import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";


actor class NFT(name:Text, owner: Principal, content: [Nat8]) = this{
    Debug.print("From NFT Canister");
    let itemName = name;
    let nftOwner = owner;
    let imageBits = content;

    public query func getName() : async Text {
        return itemName;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };

    
    public query func getAssets() : async [Nat8] {
        return imageBits;
    };

    public query func getCanisterId() : async Principal {
        return Principal.fromActor(this);
    }

};