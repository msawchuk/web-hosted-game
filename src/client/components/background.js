"use strict";

import React from "react";
import styled from "styled-components";

//backgrounds will always be cropped to have these dimensions
const BackgroundImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
  background-size: 800px;
  width: 1000px;
  height: 700px;
`;

export const Background = (img) => {
    const source = `/images/${img.img}.png`;
    return (
        <div className={"background"}>
            <BackgroundImg src={source} />
        </div>
        );
};