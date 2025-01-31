import React, { useState } from "react";
import logo from "../../public/logo.png";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft/index";
import { idlFactory as tokenIDLFactory } from "../../../declarations/token";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { opend_backend } from "../../../declarations/opend_backend";
import CURRENT_USER_ID from "../main";
import PriceLabel from "./PriceLabel";

function Item(props) {

  const [name, setName] = React.useState();
  const [owner, setOwner] = React.useState();
  const [image, setImage] = React.useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setDisplay] = useState(true);


  const id = props.id;
  const localHost = "https://turbo-space-memory-gvj94x6v77qcvq9w-4943.app.github.dev/";

  const agent = HttpAgent.createSync({ host: localHost });


  agent.fetchRootKey();

  agent.fetchRootKey().catch(err => {
    console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    console.error(err);
  });

  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });


    const name = (await NFTActor.getName());
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAssets();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));

    setName(name);
    setOwner(owner.toText());
    setImage(image);

    if (props.role == "collections") {
      const nftISListed = await opend_backend.isListed(props.id);
      if (nftISListed) {
        setOwner("OpenD");
        setBlur({ filter: "blur(4px)" });
        setSellStatus("Listed");
      } else {
        setButton(<Button handelClick={handleSell} text={"Sell"} />);
      }
    } else if (props.role == "discover") {
      const originalOwner = await opend_backend.getOriginalOwner(props.id);
      if (originalOwner != CURRENT_USER_ID.toText()) {
        setButton(<Button handelClick={handleBuy} text={"Buy"} />);
      }

      const price = await opend_backend.getListedNFTPrice(id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);

    }
  };

  React.useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell() {
    setPriceInput(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => price = e.target.value}
    />);
    setButton(<Button handelClick={sellItem} text={"Confirm"} />);

  };

  async function handleBuy() {
    console.log("handelBuy Was Triggered");
    setLoaderHidden(false);

    const tokenActor = await Actor.createActor(tokenIDLFactory, {
      agent,
      canisterId: Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai")
    });
    const sellerId = await opend_backend.getOriginalOwner(props.id);
    const itemPrice = await opend_backend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    if (result == "Success") {
      const transferResult = await opend_backend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
      console.log("Purchase: " + transferResult);
      setLoaderHidden(true);
      setDisplay(false)
    }
  }


  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false);
    const listingResult = await opend_backend.listItem(props.id, Number(price));
    if (listingResult == "Success") {
      console.log("Listing Success");
      const openDId = await opend_backend.getOpenDCanisterId();
      const transferResults = await NFTActor.transferOwnerShip(openDId);
      console.log(transferResults);
      if (transferResults == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setSellStatus("Listed");
      }
    }
  };

  return (
    <div style={{display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name} <span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
