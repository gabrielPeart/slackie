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

import MessageHeader from './components/Chat/components/messageHeader';
import Message from './components/Chat/components/message';

import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import teamsEngineStore from '../../stores/teamsEngineStore';
import SidebarStore from './components/Sidebar/store';


const MessageEmitter = new EventEmitter();
const stateThrottle = _.throttle((throttled, messages) => MessageEmitter.emit('set:messages', messages.concat(throttled)), 200);

var lastUser = false;
var messageBuild = [];

const MessageQueue = async.queue((message, next) => {
    if (message.user !== lastUser) {
        MessageEmitter.emit('new:message', <MessageHeader time={messageBuild[0] ? messageBuild[0].ts : message.ts} key={uuid()} user={message.user} />);
        messageBuild = [];
    }
    MessageEmitter.emit('new:message', <Message key={uuid()} message={message} />);
    lastUser = message.user;
    process.nextTick(next);
});


export
default React.createClass({

    getInitialState() {
        var TeamEngine = teamsEngineStore.getState();
        return {
            team: TeamEngine.selectedTeam ? TeamEngine.teams[TeamEngine.selectedTeam] : false,
            channel: SidebarStore.getState().activeChannel ? SidebarStore.getState().activeChannel : false,
            messages: [],
            throttleMessages: [],
            historyLoaded: false
        };
    },

    componentWillMount() {
        teamsEngineStore.listen(this.updateTeam);
        SidebarStore.listen(this.updateChannel);

        MessageEmitter.on('new:message', this.addMessage);
        MessageEmitter.on('set:messages', messages => {
            this.setState({
                messages: messages,
                throttleMessages: []
            });
        });
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.updateTeam);
        SidebarStore.unlisten(this.updateChannel);
        MessageEmitter.removeAllListeners();
    },

    addMessage(message) {
        this.state.throttleMessages.push(message)
        stateThrottle(this.state.throttleMessages, this.state.messages);
    },

    getMessages() {
        if (!this.state.team || !this.state.channel)
            return false;

        lastUser = false;
        messageBuild = [];
        MessageQueue.kill();

        _.forEach(this.state.team.messages[this.state.channel.id], message => MessageQueue.push(message));

        this.state.team.removeAllListeners();
        this.state.team.on('new:message', message => {
            if (message.channel === this.state.channel.id && message.team === this.state.team.slack.team.id)
                MessageQueue.push(message)
        });
    },
    updateChannel() {
        if (this.isMounted()) {
            this.setState({
                channel: SidebarStore.getState().activeChannel ? SidebarStore.getState().activeChannel : false,
                messages: []
            });
        }

        console.log(SidebarStore.getState().activeChannel);
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
                <Chat channel={this.state.channel} name={ (this.state.channel && this.state.channel.is_channel) ? ('#' + this.state.channel.name) : this.state.channel.name} messages={this.state.messages} />
            </div>
        );
    }
});