import React from 'react';
import Textarea from 'react-textarea-autosize';
import _ from 'lodash';


export
default React.createClass({

    waitForSent() {
        if (!this.message.ts)
            return;

        console.log(this.message)
        this.props.team.emit('message', Object.assign(this.message, {
            type: 'message',
            user: this.props.team.self.id
        }));

        Object.unobserve(this.message, this.waitForSent);

        this.message = {};
    },

    handelSend() {
        if (this.refs['chat-input'].value.replace(/(\r\n|\n|\r)/gm, '').length === 0) {
            return;
        }

        this.message = this.props.team.getChannelGroupOrDMByID(this.props.channel.id).send(this.refs['chat-input'].value)

        Object.observe(this.message, this.waitForSent);

        this.refs['chat-input'].value = '';

    },
    handelKeyDown(event) {
        if (event.keyCode == 13 && !event.shiftKey) {
            event.preventDefault();
            return this.handelSend();
        }
    },
    render() {
        return (
            <div className="chat-input">
                <div className="chat-inner">
                	<Textarea onKeyDown={this.handelKeyDown} className="textarea-input" ref="chat-input"/>
                </div>
            </div>
        );
    }
});