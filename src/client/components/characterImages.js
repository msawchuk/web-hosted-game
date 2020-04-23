"use strict";

import React from "react";
import styled from "styled-components";

export const CharacterImage = ({img, left, top, size, width, height}) => {
    const source = `/images/${img}.png`;
    return <img style={{ position: "absolute", left: `${left}px`, top: `${top}px`,
        backgroundSize: `${size}px`, width: `${width}px`, height: `${height}px`,
        }} src={source} />;
};

export const CharacterImages = (imgs) => {
    const chars = imgs.imgs.map((img, i) => {
        return(
            <CharacterImage img={img.path} left={img.leftPos} top={img.topPos}
                            size={img.size} width={img.width} height={img.height} key={i}/>
        );}
    );
    return(
        <div className={"characters"}>
            {chars}
        </div>
    );
};