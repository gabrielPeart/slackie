import React from 'react';
import {
    v4 as uuid
}
from 'node-uuid';
import Textarea from 'react-textarea-autosize';
import _ from 'lodash';


export
default React.createClass({

    waitForSent(msg_uuid) {
        if (!this.message[msg_uuid] || !this.message[msg_uuid].ts)
            return;

        this.props.team.emit('message', Object.assign(this.message[msg_uuid], {
            type: 'message',
            user: this.props.team.self.id
        }));

        Object.unobserve(this.message[msg_uuid], this.waitForSent);
        delete this.message[msg_uuid];
    },

    formatMessage(text) {
        _.forEach(this.props.team.users, user => {
            text = text.replace('@' + user.name, '<@' + user.id + '>');
        });
        return text;
    },

    handelSend(msg_uuid) {
        if (!this.message)
            this.message = {};

        if (this.refs['chat-input'].value.replace(/(\r\n|\n|\r)/gm, '').length === 0) {
            return;
        }

        this.message[msg_uuid] = this.props.team.getChannelGroupOrDMByID(this.props.channel.id).send(this.formatMessage(this.refs['chat-input'].value));

        Object.observe(this.message[msg_uuid], this.waitForSent.bind(this, msg_uuid));

        this.refs['chat-input'].value = '';
    },
    handelKeyDown(event) {
        if (event.keyCode == 13 && !event.shiftKey) {
            event.preventDefault();
            return this.handelSend(uuid());
        }
    },
    render() {
        return (
            <div className="chat-input">
                <div className="chat-inner">
                	<Textarea onKeyDown={this.handelKeyDown} className="textarea-input" ref="chat-input"/>
                </div>
                <div className="chat-status-thingy-bar-or-something-i-dunno">
                </div>
            </div>
        );
    }
});