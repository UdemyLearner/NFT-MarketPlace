import React from "react";
import logo from "../../public/logo.png";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft/index";
import { Principal } from "@dfinity/principal";

function Item(props) {

  const [name, setName] = React.useState();
  const [owner, setOwner] = React.useState();
  const [image, setImage] = React.useState();

  const id = Principal.fromText(props.id);
  console.log(id);
  const localHost = "https://turbo-space-memory-gvj94x6v77qcvq9w-4943.app.github.dev/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=be2us-64aaa-aaaaa-qaabq-cai/";

  const agent = new HttpAgent({host:localHost});
  if (agent) {
    console.log(agent);
  }


  async function loadNFT() {
    const NFTActor = await Actor.createActor( idlFactory, {
      agent, 
      canisterId : id,  
    });
    console.log(NFTActor);
    
    const name =(await NFTActor.getName());
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAssets();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer],{type:"image/png"}));
    
    setName(name);
    setOwner(owner.toText());
    setImage(image);

  };

  React.useEffect(() => {
    loadNFT();
  }, []);



  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name} <span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
