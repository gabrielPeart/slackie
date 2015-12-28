import React from 'react';
import Textarea from 'react-textarea-autosize';
import _ from 'lodash';


export
default React.createClass({

    handelSend() {
        if (this.refs['chat-input'].value.replace(/(\r\n|\n|\r)/gm, '').length === 0) {
            return;
        }

        let channel = this.props.team.getChannelGroupOrDMByID(this.props.channel.id);
        channel.send(this.refs['chat-input'].value);

        this.props.team.emit('message', {
            text: this.refs['chat-input'].value,
            type: 'message',
            user: this.props.team.self.id,
            channel: this.props.channel.id,
            ts: new Date().getTime() / 1000
        });

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