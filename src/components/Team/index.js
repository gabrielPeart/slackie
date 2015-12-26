import React from 'react';
import reactUpdate from 'react-addons-update';
import _ from 'lodash';
import async from 'async';
import {
    v4 as uuid
}
from 'uuid';
import {
    EventEmitter
}
from 'events';


import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import teamsEngineStore from '../../stores/teamsEngineStore';
import SidebarStore from './components/Sidebar/store';



export
default React.createClass({

    getInitialState() {
        var TeamEngine = teamsEngineStore.getState();
        var SidebarState = SidebarStore.getState();
        return {
            team: TeamEngine.selectedTeam ? TeamEngine.teams[TeamEngine.selectedTeam] : false,
            channel: SidebarState.activeChannel ? SidebarState.activeChannel : false,
            messages: (TeamEngine.selectedTeam && SidebarState.activeChannel) ? TeamEngine.teams[TeamEngine.selectedTeam].messages[SidebarState.activeChannel] : []
        };
    },

    componentWillMount() {
        teamsEngineStore.listen(this.updateTeam);
        SidebarStore.listen(this.updateChannel);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.updateTeam);
        SidebarStore.unlisten(this.updateChannel);
    },

    addMessage(message) {
        this.state.throttleMessages.push(message)
        stateThrottle(this.state.throttleMessages, this.state.messages);
    },

    getMessages() {
        if (!this.state.team || !this.state.channel)
            return false;

        this.state.team.removeAllListeners(['new:message', 'history:loaded']);


        this.state.team.on('new:message', this.updateMessages);
        this.state.team.on('history:loaded', this.updateMessages);

        this.state.team.fetchHistory(this.state.channel.id);

    },

    updateMessages() {
        if (this.isMounted()) {
            this.setState({
                messages: this.state.team.messages[this.state.channel.id]
            });
        }
    },

    updateChannel() {
        if (this.isMounted()) {
            this.setState({
                channel: SidebarStore.getState().activeChannel ? SidebarStore.getState().activeChannel : false,
                messages: []
            });
        }
        _.defer(this.getMessages);
    },
    updateTeam() {
        if (this.isMounted()) {
            this.setState({
                team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam] : false
            });
        }
    },
    render() {
        return (
            <div>
                <Sidebar channel={this.state.channel.id} team={this.state.team}/>
                <Chat channel={this.state.channel} name={ (this.state.channel && this.state.channel.is_channel) ? ('#' + this.state.channel.name) : this.state.channel.name} topic={this.state.channel.topic ? this.state.channel.topic.value.split('\n') : undefined} messages={this.state.messages} />
            </div>
        );
    }
});