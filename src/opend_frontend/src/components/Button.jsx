import React from "react";

function Button(props){
    return (
        <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
                onClick={ props.handelClick }
                className="form-Chip-label"
            >
                {props.text}
            </span>
        </div>
    );
};

console.log("Hello from Button Component");


export default Button;