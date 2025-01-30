import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";

actor class NFT(name : Text, owner : Principal, content : [Nat8]) = this {
    Debug.print("From NFT Canister");
    private let itemName = name;
    private var nftOwner = owner;
    private let imageBits = content;

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
    };

    public shared (msg) func transferOwnerShip(newOwner : Principal) : async Text {
        if (msg.caller == nftOwner) {
            nftOwner := newOwner;
            return "Success";
        } else {
            return "Error : Transfer not Initiated By NFT Owner";
        };
    };

};
