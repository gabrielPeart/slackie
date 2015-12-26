import Promise from 'bluebird';
import request from 'request';
import path from 'path';
import fs from 'fs';
import async from 'async';
import _ from 'lodash';
import Slack from 'slack-client';
import util from 'util';
import NodeWorker from 'workerjs';
import {
    EventEmitter
}
from 'events';
import commonUtil from '../commonUtil';



class SlackTeam extends EventEmitter {
    constructor(access_token, meta = false) {
        super();
        this.token = access_token;
        this.type = 'slack';
        this.fetchingHistory = [];
        this.messages = {};
        this.meta = meta;

        this.load();
        this.worker = new NodeWorker(path.join(__dirname, 'render.worker.js'), true);

        this.worker.addEventListener('message', data => {
            data = data.data;

            switch (data.type) {
                case 'message':
                    this.addMessage(data);
                    break;
                case 'history':
                    this.addHistory(data);
                    break;
                case 'info':
                    console.log(data);
                    break;
            }
        });

        this.worker.addEventListener('error', console.error);
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
            var users = {};
            _.forEach(this.slack.users, user => {
                users[user.id] = {
                    name: user.name,
                    id: user.id,
                    profile: user.profile
                };
            });
            this.worker.postMessage({
                type: 'message',
                message: message,
                channel: message.channel,
                user: message.user,
                userInfo: users
            });
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
        if (!this.messages[channel]) this.messages[channel] = [];
        var users = {};
        _.forEach(this.slack.users, user => {
            users[user.id] = {
                name: user.name,
                id: user.id,
                profile: user.profile
            };
        });

        this.worker.postMessage({
            type: 'history',
            messages: history,
            channel: channel,
            users: users
        });

    }

    addHistory(history) {
        console.log(history)
        if (!this.messages[history.channel]) this.messages[history.channel] = [];
        Array.prototype.unshift.apply(this.messages[history.channel], history.messages);
        this.emit('history:loaded');
    }


    addMessage(message) {
        if (!this.messages[message.channel]) this.messages[message.channel] = [];
        this.messages[message.channel].push(_.omit(message, ['channel', 'type']));
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