import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import Debug "mo:base/Debug";
import NFTActorClass "../nft/nft";
actor OpenD {
    public shared(msg) func mint(imgData: [Nat8], name:Text) : async Principal{
        let owner : Principal = msg.caller;

        Debug.print(debug_show (Cycles.balance()));
        Cycles.add<system>(100_500_000_000);
        Debug.print(debug_show (Cycles.balance()));
        
        let newNFT = await NFTActorClass.NFT(name, owner, imgData);
        let newNFTPrincipal = await newNFT.getCanisterId();
        return newNFTPrincipal;
    };
};
