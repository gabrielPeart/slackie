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

import Message from './components/Chat/components/message';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import teamsEngineStore from '../../stores/teamsEngineStore';
import SidebarStore from './components/Sidebar/store';




const MessageEmitter = new EventEmitter();
var lastUser = false;
var messageBuild = [];
var key = 0;
const MessageQueue = async.queue((task, next) => {
    let message = task.message;
    if (message.user !== lastUser && lastUser) {
        let newMessage = {
            user: lastUser,
            messages: messageBuild
        };
        let messager = <Message key={key} {...newMessage} />;

        MessageEmitter.emit('new:message', messager)
        messageBuild = [];
    }

    lastUser = message.user;
    messageBuild.push(message);
    key++;
    if (next)
        process.nextTick(next);
    else
        lastUser = false;
});


const stateThrottle = _.throttle((throttled, messages) => {
    MessageEmitter.emit('set:messages', messages.concat(throttled))
}, 500);

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

    componentDidMount() {
        MessageEmitter.on('new:message', this.addMessage);
        MessageEmitter.on('set:messages',messages =>{
            this.setState({
                messages: messages,
                throttleMessages: []
            });
        });
    },

    componentWillMount() {
        teamsEngineStore.listen(this.updateTeam);
        SidebarStore.listen(this.updateChannel);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.updateTeam);
        SidebarStore.unlisten(this.updateChannel);
        MessageEmitter.removeAllListeners('new:message');
        MessageEmitter.removeAllListeners('set:messages');
    },

    addMessage(message) {
        this.state.throttleMessages.push(message)

        stateThrottle(this.state.throttleMessages, this.state.messages);
        
    },

    getMessages() {
        if (!this.state.team || !this.state.channel)
            return false;

        _.forEach(this.state.team.messages[this.state.channel], (message, idx) => {
            MessageQueue.push({
                message: message
            });
        });
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
                <Sidebar channel={this.state.channel} team={this.state.team}/>
                <Chat channel={this.state.channel} team={this.state.team} messages={this.state.messages} />
            </div>
        );
    }
});