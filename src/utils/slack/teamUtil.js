import React from 'react';
import moment from 'moment';
import querystring from 'querystring';
import Promise from 'bluebird';
import request from 'request';
import path from 'path';
import fs from 'fs';
import async from 'async';
import _ from 'lodash';
import Slack from 'slack-client';
import util from 'util';
import {
    EventEmitter
}
from 'events';
import commonUtil from '../commonUtil';




const MessageHeader = React.createClass({
    render() {
        return (
            <div className="message">
                <img src={(this.props.user && this.props.user.profile) ? this.props.user.profile['image_72'] : ''} className="profile" />
                <h1>{(this.props.user && this.props.user.name) ? this.props.user.name : 'Undefined'}</h1>
                <span className="time">{moment.unix(this.props.time).calendar()}</span>
            </div>
        );
    }
});


const ChatMessage = React.createClass({
    render() {
        var text = _.unescape(querystring.unescape(this.props.message.text));
        return (
            <p>{text}</p>
        );
    }
});



class SlackTeam extends EventEmitter {
    constructor(access_token, meta = false) {
        super();
        this.token = access_token;
        this.type = 'slack';
        this.fetchingHistory = [];
        this.messages = {};
        this.meta = meta;


        this.setQueues();
        this.load();

    }



    setQueues() {
        var lastUser = false;
        var messageBuild = [];
        var Historys = [];
        var messageHistoryBuild = [];

        this.HistoryMessageQueue = async.queue((message, next) => {
            if (message.user !== lastUser) {
                Historys.push(<MessageHeader time={message.ts}  user={this.slack.users[message.user]} />)
                messageHistoryBuild = [];
            }
            Historys.push(<ChatMessage message={message} />);

            lastUser = message.user;

            if (this.HistoryMessageQueue.length() === 0) {
                this.addHistory({
                    messages: Historys,
                    channel: message.channel
                });
                Historys = [];
            }
            process.nextTick(next);
        });


        this.MessageQueue = async.queue((message, next) => {
            console.log(message)
            if (message.user !== lastUser) {
                this.addMessage({
                    message: <MessageHeader time={message.ts} user={this.slack.users[message.user]} />,
                    channel: message.channel
                });
                messageBuild = [];
            }
            this.addMessage({
                message: <ChatMessage message={message} />,
                channel: message.channel
            })
            lastUser = message.user;
            process.nextTick(next);
        });
    }



    load() {
        this.slack = new Slack(this.token, true, false);

        this.slack.on('open', () => {
            this.emit('logged-in');
            this.getTeaminfo();
            console.log('You are @', this.slack.self.name, 'of', this.slack.team.name);
            console.log(this)
        });

        this.slack.on('message', message => {
            this.MessageQueue.push(message);
        });

        this.slack.on('error', error => this.emit('error', error));

        this.slack.login();
    }

    fetchHistory(channel, latest = false, count = 100) {
        var Channels = Object.assign(this.slack.channels, this.slack.dms, this.slack.groups);

        if (!latest) latest = (Channels[channel].latest && Channels[channel].latest.ts) ? Channels[channel].latest.ts : false;

        request('https://slack.com/api/channels.history?token=' + this.token + '&inclusive=1&channel=' + channel + '&count=' + count + '&unreads=1' + (latest ? ('&latest=' + latest) : ''), {
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
        _.forEach(history, message => this.HistoryMessageQueue.push(Object.assign(message, {
            channel: channel
        })));
    }

    addHistory(history) {

        console.log(history)

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