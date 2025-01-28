import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
actor OpenD {
    public shared(msg) func mint(imgData: [Nat8], name:Text) : async Principal{
        let owner : Principal = msg.caller;
    };
};
