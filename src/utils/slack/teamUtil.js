import React from 'react';
import request from 'request';
import async from 'async';
import path from 'path';
import _ from 'lodash';
import notifier from 'node-notifier';
import messageFormatUtil from './parseFormattingUtil';
import Slack from 'slack-client';
import {
    ipcRenderer
}
from 'electron';
import {
    EventEmitter
}
from 'events';

import MessageHeader from './components/MessageHeader';
import ChatMessage from './components/message';

const notifyMessage = (msg, team) => {
    if (ipcRenderer.sendSync('app:get:focused') || msg.user === team.self.id)
        return;

    const channel = Object.assign(team.channels, team.dms, team.groups)[msg.channel];

    if (!msg.text.includes(team.self.id) && !channel.is_im)
        return;

    const users = Object.assign(team.users, team.bots);

    const title = !channel.is_im ? ('in ' + (channel.is_channel ? '#' : '') + channel.name) : 'from ' + users[msg.user].name;

    var ParsedText = new messageFormatUtil(_.unescape(msg.text), users, true).parsed;

    const text = channel.is_im ? ParsedText : '@' + users[msg.user].name + ': ' + ParsedText;

    notifier.notify({
        title: '[' + team.team.name + '] New message ' + title,
        message: text,
        wait: false,
        icon: path.join(__dirname, '../../../', 'images/slack-notify.png')
    });
}

_.mixin({
   	sortKeysBy: (obj, comparator) => {
        const keys = _.sortBy(_.keys(obj), key => {
            return comparator ? comparator(obj[key], key) : key;
        });
    
        return _.object(keys, _.map(keys, key => {
            return obj[key];
        }));
    }
});

class SlackTeam extends EventEmitter {
    constructor(access_token, meta = false) {
        super();
        this.token = access_token;
        this.type = 'slack';

        this.LastMessage = {};
        this.fetchingHistory = [];

        this.messages = {};
        this.meta = meta;

        this.gotHistory = [];

        this._setQueues();
        this._load();
    }

    _setQueues() {
        let Historys = {};

        let builtHistory = {};

        this.MessageQueue = async.queue((message, next) => {
            if(!this.LastMessage[message.channel])
               this.LastMessage[message.channel] = {};

            if (message.history) {
            	if(!builtHistory[message.channel])
            		builtHistory[message.channel] = 0
                if(!Historys[message.channel])
                	Historys[message.channel] = {}

                if (message.user !== this.LastMessage[message.channel].user) 
                	Historys[message.channel][message.user + ':' + (message.ts - 0.0001)] = <MessageHeader time={message.ts} user={Object.assign(this.slack.users, this.slack.bots)[message.user]} />;
                Historys[message.channel][message.user + ':' + message.ts] = <ChatMessage Emmiter={this} users={Object.assign(this.slack.users, this.slack.bots)} {...message} />;

                builtHistory[message.channel]++;
                if (message.HistoryLength === builtHistory[message.channel]) {
                    this._addHistory({
                        messages: Historys[message.channel],
                        channel: message.channel
                    });
                    delete Historys[message.channel];
                    delete builtHistory[message.channel];
                }
            } else {
                if (message.user !== this.LastMessage[message.channel].user) {
                	this._addMessage({
                		message: {
                			[message.user + ':' + (message.ts - 0.0001)]: <MessageHeader time={message.ts} users={Object.assign(this.slack.users, this.slack.bots)} user={Object.assign(this.slack.users, this.slack.bots)[message.user]} />
                		},
                		channel: message.channel
                	});
                }
                this._addMessage({
                	message: {
                		[message.user + ':' + message.ts]: <ChatMessage Emmiter={this} users={Object.assign(this.slack.users, this.slack.bots)} {...message} />
                	},
                	channel: message.channel
                });
                notifyMessage(message, this.slack);
            }
            this.LastMessage[message.channel] = message;
            next();
        });
    }

    _handelSubtypes(message, history) {
        switch (message.subtype) {
            case 'message_changed':
                var eventName = message.channel + ':' + message.previous_message.user + ':' + message.previous_message.ts;
                this.emit(eventName, message);
                break;
            case 'file_share':
            case 'me_message':
                this.MessageQueue.push(message);
                break;
            case 'bot_message':
                message.user = message.bot_id;
                message.text = (message.attachments && message.attachments[0]) ? message.attachments[0].fallback : '';
                this.MessageQueue.push(message);
                break;
            default:
                console.log(message)
        }
    }


    _load() {
        this.slack = new Slack(this.token, true, false);

        this.slack.on('open', () => {
            this.emit('logged-in');
            this._getTeaminfo();
            console.log('You are @', this.slack.self.name, 'of', this.slack.team.name);
        });

        this.slack.on('message', message => {
            if (message.subtype)
                return this._handelSubtypes(message);
            if (message.hidden)
                return console.info(message);
            this.MessageQueue.push(message);
        });

        this.slack.on('error', error => this.emit('error', error));

        this.slack.login();
    }

    fetchHistory(channel, latest, count = 100) {
        this.LastMessage = {};

        if (_.includes(this.gotHistory, channel) && !latest) {
            this.emit('history:loaded');
            return console.log('History already fetched for', channel);
        }

        var Channels = Object.assign(this.slack.channels, this.slack.dms, this.slack.groups);

        if (!latest) latest = (Channels[channel] && Channels[channel].latest && Channels[channel].latest.ts) ? Channels[channel].latest.ts : false;

        var type = (channel.charAt(0) === 'C') ? 'channels' : ((channel.charAt(0) === 'G') ? 'groups' : 'im');

        request('https://slack.com/api/' + type + '.history?token=' + this.token + '&inclusive=1&channel=' + channel + '&count=' + count + '&unreads=1' + (latest ? ('&latest=' + latest) : ''), {
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                this._getHistory(channel, body.messages ? body.messages.reverse() : []);
            } else {
                console.error(err || resp.statusCode);
            }
        });
    }

    _getHistory(channel, history) {
        this.gotHistory.push(channel);

        _.forEach(history, message => {

            message = Object.assign(message, {
                channel: channel,
                history: true,
                HistoryLength: history.length
            });

            if (message.subtype)
                return this._handelSubtypes(message, true);

            this.MessageQueue.push(message);
        });
    }

    _addHistory(history) {
        if (!this.messages[history.channel]) 
        	this.messages[history.channel] = {};

        const historyStorted = _.sortKeysBy(Object.assign(this.messages[history.channel], history.messages), (value, key) => {
    		return key.split(':')[1];
		});
        this.messages[history.channel] = historyStorted;
        this.emit('history:loaded');
    }


    _addMessage(message) {
        if (!this.messages[message.channel]) 
        	this.messages[message.channel] = {};

        this.messages[message.channel] = Object.assign(this.messages[message.channel], message.message);
        this.emit('new:message', {
            channel: message.channel,
            team: this.slack.team.id
        });
    }

    _getTeaminfo() {
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