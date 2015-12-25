import Promise from 'bluebird';
import request from 'request';
import path from 'path';
import fs from 'fs';
import async from 'async';
import _ from 'lodash';
import Slack from 'slack-client';
import {
    app
}
from 'remote';
import {
    EventEmitter
}
from 'events';

import commonUtil from '../commonUtil';
const message_cacheDir = path.join(app.getPath('userData'), 'message_cache');


if (!fs.existsSync(message_cacheDir))
    fs.mkdirSync(message_cacheDir);

var HistoryEmitter = new EventEmitter();

const getHistoryQueue = async.queue((task, next) => {
    request('https://slack.com/api/channels.history?token=' + task.token + '&inclusive=1&channel=' + task.channel + '&count=1000&unreads=1', {
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            HistoryEmitter.emit('new:history', {
                messages: body.messages ? body.messages.reverse() : [],
                channel: task.channel,
                team: task.team
            });
            process.nextTick(next);
        } else {
            console.error(err || resp.statusCode);
            process.nextTick(next);
        }
    });
}, 4);




class Team extends EventEmitter {
    constructor(access_token, meta = false) {
        super();
        this.token = access_token;

        this.loadedCachedMessages = false;
        this.messages = {};

        this.meta = meta;

        this.slack = new Slack(access_token, true, false);

        this.slack.on('open', () => {
            this.emit('logged-in');
            console.log('You are @', this.slack.self.name, 'of', this.slack.team.name);

            this.getTeaminfo();
            this.loadCachedMessages();
        });


        this.slack.on('message', message => {
            this.addMessage(message.channel, {
                text: message.text,
                ts: message.ts,
                user: message.user,
                type: message.type
            });
        });


        this.slack.on('error', error => this.emit('error', error));

        this.slack.login();

        HistoryEmitter.on('new:history', history => {
            if (this.slack && this.slack.authenticated && history.team === this.slack.team.id) {
                if (!this.messages[history.channel]) this.messages[history.channel] = [];
                _.merge(this.messages[history.channel], history.messages);
                this.emit('loaded:history');
                this.cacheMessages();
            }
        });
    }

    loadCachedMessages() {
        const messageCahePath = path.join(message_cacheDir, this.slack.team.id + '.json');

        commonUtil.readJson(messageCahePath)
            .then(json => {
                _.merge(this.messages, json);
                this.loadedCachedMessages = true;
                this.emit('loaded:messages');
            }).catch(() => {
                console.log('No cached messages for', this.slack.team.id);
                this.initHistory();
                this.loadedCachedMessages = true;
            });

    }

    initHistory() {
        _.forEach(this.slack.channels, channel => {
            if (channel.is_channel && !channel.is_archived && channel.is_member) {
                getHistoryQueue.push({
                    team: this.slack.team.id,
                    token: this.token,
                    channel: channel.id
                });
            }
        });
        _.forEach(this.slack.dms, dm => {
            if (dm.is_open && dm.is_im) {
                getHistoryQueue.push({
                    team: this.slack.team.id,
                    token: this.token,
                    channel: dm.id
                });
            }
        });
        _.forEach(this.slack.groups, group => {
            if (group.is_open && group.is_group && !group.is_archived) {
                getHistoryQueue.push({
                    team: this.slack.team.id,
                    token: this.token,
                    channel: group.id
                });
            }
        });
    }

    getHistory(channel) {
        getHistoryQueue.push({
            team: this.slack.team.id,
            token: this.token,
            channel: channel
        });
    }

    addMessage(channel, message) {
        if (!this.messages[channel]) this.messages[channel] = [];
        this.messages[channel].push(message);
        this.emit('new:message', Object.assign({
            channel: channel,
            team: this.slack.team.id
        }, message));
        this.cacheMessages();
    }


    cacheMessages() {
        if (!this.loadedCachedMessages)
            return false;

        const messageCahePath = path.join(message_cacheDir, this.slack.team.id + '.json');

        commonUtil.saveJson(messageCahePath, this.messages);
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
default Team;