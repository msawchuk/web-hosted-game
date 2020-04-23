"use strict";

import React, { Component } from "react";
import styled from "styled-components";

const AnnouncementBase = styled.div`
  display: flex;
  justify-content: center;
  grid-area: main;
`;

export class Github extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        let token;
        let code = this.props.location.search.substring(6);
        fetch('v1/github/' + code, {
            method: "POST",
        }).then(response => response.json()).then(data => {
            token = data.token;
            fetch('https://api.github.com/user', {
                method: "GET",
                headers: {
                    "Authorization": "token " + data.token,
                }
            }).then(res => res.json()).then(data => {
                this.validateUser(data.login, token);
            });
        });
    }

    validateUser(username, token) {
        fetch('v1/user/' + 'github:' + username, {
            method: "HEAD"
        }).then(response => {
            if (response.status === 204) {
                this.createUser(username, token);
            } else {
                this.loginUser(username, token);
            }
        })
    }

    loginUser(username, token) {
        username = username.toLowerCase();
        username =  'github:' + username;
        let body = JSON.stringify({
            username: username,
            token: token
        });
        fetch("v1/githubLogin", {
            method: 'POST',
            body: body,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            if (response.status === 200) {
                this.redirect(username);
            }
        })
    }

    createUser(username, token) {
        let email;
        fetch('https://api.github.com/user/emails', {
            method: "GET",
            headers: {
                "Authorization": "token " + token,
            }
        }).then(response => response.json()).then(data => {
            email = data[0].email;
            let body = JSON.stringify({
                username: 'github:' + username,
                primary_email: email,
                password: token + 'A!',
            });
            fetch('v1/user', {
                method: 'POST',
                body: body,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                }
            }).then(res => this.loginUser(username, token));
        });

    }

    redirect(username) {
        this.props.logIn(username);
        this.props.history.push('/profile/' + username);
    }

    render() {
        return (
            <AnnouncementBase>
                <h2>Processing Github account...</h2>
            </AnnouncementBase>
        );
    }
}
