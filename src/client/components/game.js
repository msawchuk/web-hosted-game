
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Background } from "./background";
import { CharacterImages } from "./characterImages";
import { Dialogue } from "./dialogue";
import styled from "styled-components";

/*************************************************************************/

export class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: 0,
      decisionsInfo: {},
      eventInfo: {
          backgroundImage: "",
          characterImages: [""],
          dialogue: [{
              text: "",
              leftPos: 0,
              topPos: 0
          }]
      }
    };
    this.endOfEvent = this.endOfEvent.bind(this);
  }

  componentDidMount() {
    //get event id, then find the info for that event
    fetch(`/info/${this.props.match.params.username}`)
        .then(res => res.json())
        .then(data => this.setState({
          eventId: data.eventId,
          decisionsInfo: {
              value1: data.value1,
              value2: data.value2,
              value3: data.value3,
          }}))
        .then(() => {
          this.getEventInfo(this.state.eventId);
        }).catch(err => console.log(err));
  }

  getEventInfo(eventId) {
    fetch(`/event/${this.state.eventId}`)
        .then(res => res.json())
        .then(data => this.setState({
            eventInfo: data
        }))
        .catch(err => console.log(err));
  }

  endOfEvent = () => {
      console.log("end of event");
  };

  render() {
      let eventInfo = this.state.eventInfo;
      let decisionsInfo = this.state.decisionsInfo;
    return(
        <div>
            <Background img={eventInfo.backgroundImage} />
            <CharacterImages imgs={eventInfo.characterImages}/>
            <Dialogue dialogue={eventInfo.dialogue} decisionsInfo={decisionsInfo} endOfEvent={this.endOfEvent} onClick={this.onClick}/>
        </div>
    );
  }
}