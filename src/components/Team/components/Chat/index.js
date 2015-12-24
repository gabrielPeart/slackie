import React from 'react';
import _ from 'lodash';

import teamsEngineStore from '../../../../stores/teamsEngineStore';

import SidebarStore from '../Sidebar/store';

import ChatStore from './store';
import ChatActions from './actions';

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
            messages: (TeamEngine.selectedTeam && SelectedChannel) ? TeamEngine.teams[TeamEngine.selectedTeam].messages[SelectedChannel] : false
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
        if (!this.state.messages)
            return [];
        var messages = [];
        _.forEach(this.state.messages, (message, idx) => {
            messages.push(
                <p className="messsage" key={idx}>{message.text}</p>
            );
        });
        return messages;
    },

    render() {
        var messages = this.getMessages();
        return (
            <div className="page">

            {messages}


            </div>
        );
    }
});