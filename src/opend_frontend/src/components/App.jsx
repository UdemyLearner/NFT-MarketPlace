import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";

import Item from "./Item";
import Minter from "./Minter";

function App() {

  // const NFTID = "be2us-64aaa-aaaaa-qaabq-cai"; 

  return (
    <div className="App">
      <Header />
      {/* <Minter /> */}
      {/* <Item id = {NFTID}/> */}
      
      <Footer />
    </div>
  );
}

export default App;
