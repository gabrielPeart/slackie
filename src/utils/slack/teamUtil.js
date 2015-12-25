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


        this.fetchingHistory = false;
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
            if (history.team === this.slack.team.id) {

                if (!this.messages[history.channel]) this.messages[history.channel] = [];
                _.merge(this.messages[history.channel], history.messages);

                history.messages = this.messages[history.channel];
                this.cacheMessages(history);
            }
        });
    }


    fetchHistory(latest = 'now', channel) {
        this.fetchingHistory = true;
        request('https://slack.com/api/channels.history?token=' + this.token + '&inclusive=1&channel=' + channel + '&count=100&unreads=1&latest=' + start, {
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                HistoryEmitter.emit('new:history', {
                    messages: body.messages ? body.messages.reverse() : [],
                    channel: channel,
                    team: this.slack.team.id
                });
            } else {
                console.error(err || resp.statusCode);
            }
            this.fetchingHistory = false;
        });
    }


    loadCachedMessages() {

        if (!fs.existsSync(path.join(message_cacheDir, this.slack.team.id)))
            fs.mkdirSync(path.join(message_cacheDir, this.slack.team.id));


        var Channels = Object.assign(this.slack.channels, this.slack.dms, this.slack.groups);

        _.forEach(Channels, channel => {
            if (fs.existsSync(path.join(message_cacheDir, this.slack.team.id, channel + '.json'))) {
                commonUtil.readJson(path.join(message_cacheDir, this.slack.team.id, channel + '.json'))
                    .then(json => {
                        if (!this.messages[history.channel])
                            this.messages[history.channel] = [];

                        _.merge(this.messages[history.channel], json);
                    });
            } else {
                getHistoryQueue.push({
                    team: this.slack.team.id,
                    token: this.token,
                    channel: channel.id
                });
            }
        });




        /*

        commonUtil.readJson(messageCahePath)
            .then(json => {
                _.merge(this.messages, json);
                this.loadedCachedMessages = true;
                this.emit('loaded:messages');
            }).catch(() => {
                console.log('No cached messages for', this.slack.team.id);
                this.initHistory();
                this.loadedCachedMessages = true;
            }); */
    }

    initHistory() {

        var Channels = Object.assign(this.slack.channels, this.slack.dms, this.slack.groups);

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


    cacheMessages(messages) {
        if (messages) {
            var channelCahe = path.join(message_cacheDir, messages.team, messages.channel + '.json');
            commonUtil.saveJson(channelCahe, messages.messages);
        } else {
            _.forEach(this.messages, (messages, channel) => {
                let channelCahe = path.join(message_cacheDir, this.slack.team.id, channel + '.json');
                commonUtil.saveJson(channelCahe, messages);
            });
        }
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