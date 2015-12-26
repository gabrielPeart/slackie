import _ from 'lodash';
import React from 'react';
import querystring from 'querystring';
import async from 'async';
import {
    v4 as uuid
}
from 'uuid';


self.onmessage = data => {
    data = data.data;

    switch (data.type) {
        case 'history':
            _.forEach(data.messages, message => HistoryMessageQueue.push(Object.assign(message, {
                channel: data.channel,
                userInfo: data.users
            })));
            break;
        case 'message':
            MessageQueue.push(data);
            break;
    }
};


var lastUser = false;
var messageBuild = [];

const MessageQueue = async.queue((message, next) => {
    if (message.user !== lastUser) {
        postMessage({
            message: React.renderToString(<MessageHeader time={message.ts} user={message.userInfo[message.user]} />),
            type: 'message',
            channel: message.channel
        });
        messageBuild = [];
    }
    postMessage({
        message: React.renderToString(<ChatMessage message={message.message} />),
        type: 'message',
        channel: message.channel
    });
    lastUser = message.user;
    process.nextTick(next);
});





var lastHistoryUser = false;
var messageHistoryBuild = [];
var Historys = [];

const HistoryMessageQueue = async.queue((message, next) => {
    if (message.user !== lastHistoryUser) {
        Historys.push({
            message: React.renderToString(<MessageHeader time={messageBuild[0] ? messageBuild[0].ts : message.ts}  user={message.userInfo[message.user]} />),
            type: 'message',
            channel: message.channel
        })
        messageBuild = [];
    }
    Historys.push({
        message: React.renderToString(<ChatMessage message={message} />),
        type: 'message',
        ts: message.ts,
        channel: message.channel
    });

    lastUser = message.user;

    if (HistoryMessageQueue.length() === 0) {
        postMessage({
            type: 'history',
            messages: Historys,
            channel: message.channel
        });
        Historys = [];
    }
    process.nextTick(next);
});


const MessageHeader = React.createClass({
    render() {
        return (
            <div className="message">
                <img src={(this.props.user && this.props.user.profile.image_original) ? this.props.user.profile.image_original : ''} className="profile" />
                <h1>{(this.props.user && this.props.user.name) ? this.props.user.name : 'Undefined'}</h1>
                <span className="time">{this.props.time}</span>
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