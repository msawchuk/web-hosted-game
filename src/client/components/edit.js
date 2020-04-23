
"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    ErrorMessage,
    FormBase,
    FormInput,
    FormLabel,
    FormButton,
    ModalNotify
} from "./shared";
import { validPassword, validUsername } from "../../shared";

/*************************************************************************/

export class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.currentUser,
            first_name: "",
            last_name: "",
            city: "",
            primary_email: "",
            password: "",
            error: ""
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onAcceptEdit = this.onAcceptEdit.bind(this);
    }

    onChange(ev) {
        // Update from form and clear errors
        this.setState({ [ev.target.name]: ev.target.value, error: "" });
    }

    onSubmit(ev) {
        ev.preventDefault();
        // Only proceed if there are no errors
        if (!this.state.hasOwnProperty("error") || this.state.error !== "") return;
        fetch("/v1/user", {
            method: "PUT",
            body: JSON.stringify(this.state),
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        })
            .then(res => {
                if (res.ok) {
                    // Notify users
                    this.setState({
                        notify: `Profile edited successfully`
                    });
                } else res.json().then(error => this.setState(error));
            })
            .catch(err => console.log(err));
    }

    onAcceptEdit() {
        this.props.history.push("/profile/" + this.state.username);
    }

    fetchUser(username) {
        this.setState({ error: null });
        fetch(`/v1/user/${username}`)
            .then(res => res.json())
            .then(data => {
                this.setState(data);
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchUser(this.state.username);
    }

    render() {
        return (
            <div style={{ gridArea: "main" }}>
                {this.state.notify ? (
                    <ModalNotify
                        msg={this.state.notify}
                        onAccept={this.onAcceptEdit}
                    />
                ) : null}
                <ErrorMessage msg={this.state.error} />
                <FormBase>
                    <FormLabel htmlFor="first_name">First Name:</FormLabel>
                    <FormInput
                        name="first_name"
                        placeholder="First Name"
                        onChange={this.onChange}
                        value={this.state.first_name}
                    />

                    <FormLabel htmlFor="last_name">Last Name:</FormLabel>
                    <FormInput
                        name="last_name"
                        placeholder="Last Name"
                        onChange={this.onChange}
                        value={this.state.last_name}
                    />

                    <FormLabel htmlFor="city">City:</FormLabel>
                    <FormInput
                        name="city"
                        placeholder="City"
                        onChange={this.onChange}
                        value={this.state.city}
                    />
                    <div />
                    <FormButton onClick={this.onSubmit}>Edit</FormButton>
                </FormBase>
            </div>
        );
    }
}

Edit.propTypes = {
    history: PropTypes.object.isRequired
};
