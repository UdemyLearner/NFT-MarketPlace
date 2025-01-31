import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import NFTActorClass "../nft/nft";

actor OpenD {

    Debug.print("Hello");

    private type Listing = {
        itemOwner : Principal;
        itemPrice : Nat;
    };

    var mapOfNfts = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

    public shared (msg) func mint(imgData : [Nat8], name : Text) : async Principal {
        let owner : Principal = msg.caller;

        Debug.print(debug_show (Cycles.balance()));
        Cycles.add<system>(100_500_000_000);
        let newNFT = await NFTActorClass.NFT(name, owner, imgData);
        Debug.print(debug_show (Cycles.balance()));

        let newNFTPrincipal = await newNFT.getCanisterId();

        mapOfNfts.put(newNFTPrincipal, newNFT);
        addToOwnershipMap(owner, newNFTPrincipal);

        return newNFTPrincipal;
    };

    private func addToOwnershipMap(owner : Principal, nftID : Principal) {
        var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        ownedNFTs := List.push(nftID, ownedNFTs);
        mapOfOwners.put(owner, ownedNFTs);
    };

    public query func getListedNFTs() : async [Principal] {
        let ids = Iter.toArray(mapOfListings.keys());
        return ids;
    };

    public query func getOwnedNFTs(user : Principal) : async [Principal] {
        var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        return List.toArray(userNFTs);
    };

    public shared (msg) func listItem(id : Principal, price : Nat) : async Text {
        var item : NFTActorClass.NFT = switch (mapOfNfts.get(id)) {
            case null return "NFT does'nt exist.";
            case (?result) result;
        };
        let owner = await item.getOwner();
        if (Principal.equal(owner, msg.caller)) {
            let newListing : Listing = {
                itemOwner = owner;
                itemPrice = price;
            };
            mapOfListings.put(id, newListing);
            return "Success";
        } else {
            return "You Don't Own any NFT's.";
        };
    };

    public query func getOpenDCanisterId() : async Principal {
        return Principal.fromActor(OpenD);
    };

    public query func isListed(id : Principal) : async Bool {
        if (mapOfListings.get(id) == null) {
            return false;
        };
        return true;
    };

    public query func getOriginalOwner(id : Principal) : async Principal {
        var listing : Listing = switch (mapOfListings.get(id)) {
            case null return Principal.fromText("");
            case (?result) result;
        };
        return listing.itemOwner;
    };

    public query func getListedNFTPrice(id : Principal) : async Nat {
        var listing : Listing = switch (mapOfListings.get(id)) {
            case null return 0;
            case (?result) result;
        };
        return listing.itemPrice;

    };

};
