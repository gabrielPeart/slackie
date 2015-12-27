import React from 'react';
import request from 'request';
import async from 'async';
import _ from 'lodash';
import Slack from 'slack-client';
import {
    EventEmitter
}
from 'events';

import MessageHeader from './components/MessageHeader';
import ChatMessage from './components/message';



class SlackTeam extends EventEmitter {
    constructor(access_token, meta = false) {
        super();
        this.token = access_token;
        this.type = 'slack';
        this.fetchingHistory = [];
        this.messages = {};
        this.meta = meta;

        this.gotHistory = [];

        this.setQueues();
        this.load();
    }

    setQueues() {
        var messageBuild = [];
        var Historys = [];
        var messageHistoryBuild = [];
        this.LastMessage = {};

        var builtHistory = 0;

        this.MessageQueue = async.queue((message, next) => {
            if (message.history) {
                builtHistory++
                if (message.user !== this.LastMessage.user) {
                    Historys.push(<MessageHeader time={message.ts} user={this.slack.users[message.user]} />)
                    messageHistoryBuild = [];
                }
                Historys.push(<ChatMessage Emmiter={this} {...message} />);
                if (message.length === builtHistory) {
                    this.addHistory({
                        messages: Historys,
                        channel: message.channel
                    });
                    Historys = [];
                    builtHistory = 0;
                }
            } else {
                if (message.user !== this.LastMessage.user) {
                    this.addMessage({
                        message: <MessageHeader time={message.ts} user={this.slack.users[message.user]} />,
                        channel: message.channel
                    });
                    messageBuild = [];
                }
                this.addMessage({
                    message: <ChatMessage Emmiter={this} {...message} />,
                    channel: message.channel
                })
            }
            this.LastMessage = message;
            process.nextTick(next);
        });
    }

    handelSubtypes(message){

		switch(message.subtype) {
		    case 'message_changed':
		    	var eventName = message.channel + ':' + message.previous_message.user + ':' + message.previous_message.ts + ':' + message.previous_message.text;
		        this.emit(eventName, message)
		        break;
		}

    }


    load() {
        this.slack = new Slack(this.token, true, false);

        this.slack.on('open', () => {
            this.emit('logged-in');
            this.getTeaminfo();
            console.log('You are @', this.slack.self.name, 'of', this.slack.team.name);
        });

        this.slack.on('message', message => {
        	if(message.subtype)
        		return this.handelSubtypes(message);
        	if(message.hidden)
        		return console.info(message);
            this.MessageQueue.push(message);
        });

        this.slack.on('error', error => this.emit('error', error));

        this.slack.login();
    }

    fetchHistory(channel, latest, count = 100) {
    	this.LastMessage = {};

    	if(_.includes(this.gotHistory, channel) && !latest){
    		this.emit('history:loaded');
    		return console.log('History already fetched for', channel);
    	}

        var Channels = Object.assign(this.slack.channels, this.slack.dms, this.slack.groups);

        if (!latest) latest = (Channels[channel].latest && Channels[channel].latest.ts) ? Channels[channel].latest.ts : false;

        var type = (channel.charAt(0) === 'C') ? 'channels' : ((channel.charAt(0) === 'G') ? 'groups' : 'im');

        request('https://slack.com/api/' + type + '.history?token=' + this.token + '&inclusive=1&channel=' + channel + '&count=' + count + '&unreads=1' + (latest ? ('&latest=' + latest) : ''), {
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                this.getHistory(channel, body.messages ? body.messages.reverse() : []);
            } else {
                console.error(err || resp.statusCode);
            }
        });
    }

    getHistory(channel, history) {
    	this.gotHistory.push(channel);

        _.forEach(history, message => this.MessageQueue.push(Object.assign(message, {
            channel: channel,
            history: true,
            length: history.length
        })));
    }

    addHistory(history) {
        if (!this.messages[history.channel]) this.messages[history.channel] = [];
        Array.prototype.unshift.apply(this.messages[history.channel], history.messages);
        this.emit('history:loaded');
    }


    addMessage(message) {
        if (!this.messages[message.channel]) this.messages[message.channel] = [];
        this.messages[message.channel].push(message.message);
        this.emit('new:message', {
            channel: message.channel,
            team: this.slack.team.id
        });
    }

    getTeaminfo() {
        request('https://slack.com/api/team.info?token=' + this.token, {
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                this.meta = body.team;
                this.emit('meta-refreshed', body.team);
            } else {
                console.error(err || resp.statusCode);
            }
        });
    }
}

export
default SlackTeam;