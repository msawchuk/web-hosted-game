
"use strict";

import React from "react";
import styled from "styled-components";

/*************************************************************************/

const LandingBase = styled.div`
  display: flex;
  justify-content: center;
  grid-area: main;
`;

export const Landing = () => (
  <LandingBase>
      <div>
          <h2>Get ready for an enjoyable and rewarding gameplay experience!</h2>
      </div>
  </LandingBase>
);
