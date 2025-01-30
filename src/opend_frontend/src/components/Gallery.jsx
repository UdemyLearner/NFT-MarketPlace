import React from "react";
import Item from "./Item";

function Gallery(props) {
  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center"></div>
          <Item id="be2us-64aaa-aaaaa-qaabq-cai"/>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
