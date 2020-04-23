"use strict";

import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

export const Dialogue = (dialogue, decisionsInfo, endOfEvent) => {
    const [curDial, setCurDial] = useState(0);
    dialogue = dialogue.dialogue;
    if (curDial === dialogue.length) {
        setCurDial(0);
    }
    console.log(curDial);
    return (curDial < dialogue.length ?
        <div style={{ position: "absolute", left: `${dialogue[curDial].leftPos}px`, top: `${dialogue[curDial].topPos}px`,
            backgroundColor: "white",
            width: `${dialogue[curDial].boxWidth}px`,
            height:`${dialogue[curDial].boxHeight}px`}} onClick={() => {setCurDial(curDial+1);}}>
            <a style={{ position: "relative", fontFamily: "Comic Sans MS, cursive, sans-serif"}} >
                {dialogue[curDial].text}
            </a>
        </div> : <div/>
    );
};

Dialogue.propTypes = {
    dialogue: PropTypes.arrayOf(PropTypes.object),
    decisionsInfo: PropTypes.object,
    endOfEvent: PropTypes.func,
};
//onClick={() => {console.log("click");setCurDial(curDial+1);}}