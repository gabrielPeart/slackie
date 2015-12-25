import React from 'react';
import _ from 'lodash';
import {
    v4 as uuid
}
from 'uuid';

import teamsEngineStore from '../../../../stores/teamsEngineStore';
import SidebarStore from '../Sidebar/store';
import ChatStore from './store';
import ChatActions from './actions';

import Message from './components/message';



const If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});

export
default React.createClass({

    getInitialState() {
        var TeamEngine = teamsEngineStore.getState();
        var SelectedChannel = SidebarStore.getState().activeChannel;

        return {
            team: TeamEngine.selectedTeam ? TeamEngine.teams[TeamEngine.selectedTeam] : false,
            selectedTeam: TeamEngine.selectedTeam ? TeamEngine.selectedTeam : false,
            selectedChannel: SidebarStore.getState().activeChannel,
            messages: (TeamEngine.selectedTeam && SelectedChannel) ? TeamEngine.teams[TeamEngine.selectedTeam].messages[SelectedChannel] : false,
            render: []
        };
    },
    componentWillMount() {
        teamsEngineStore.listen(this.update);
        ChatStore.listen(this.update);
        SidebarStore.listen(this.update);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.update);
        ChatStore.unlisten(this.update);
        SidebarStore.unlisten(this.update);
    },
    update() {
        if (this.isMounted()) {

            if (SidebarStore.getState().activeChannel !== this.state.SelectedChannel && teamsEngineStore.getState().selectedTeam && teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam])
                this.listenForNew();

            this.setState({
                team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam] : false,
                selectedChannel: SidebarStore.getState().activeChannel,
                messages: (teamsEngineStore.getState().selectedTeam && SidebarStore.getState().activeChannel) ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam].messages[SidebarStore.getState().activeChannel] : false
            });
        }
    },

    listenForNew() {
        if (!this.state.team)
            return;
        this.state.team.removeAllListeners('new:message');



        this.state.team.on('new:message', this.update)
    },


    getMessages() {
        var messagegroups = {};

        var lastUser = false;

        var messageBuild = [];

        _.forEach(this.state.messages, (message, idx) => {
            if (message.user !== lastUser && lastUser) {
                messagegroups[uuid()] = {
                    user: lastUser,
                    messages: messageBuild
                };
                messageBuild = [];
            }
            lastUser = message.user;
            messageBuild.push(message);
        });

        _.forEach(messagegroups, (message, idx) => {
            this.state.render.push(
                <Message key={idx} messages={message.messages} />
            );
        });      


    },

    render() {
        this.getMessages()
        return (
            <div className="page">
                <div className="header">
                    <h1>#general</h1>
                </div>

                <div className="messages">
                    {this.state.render}
                </div>
            
                <div className="chat-input">
                </div>
            </div>
        );
    }
});