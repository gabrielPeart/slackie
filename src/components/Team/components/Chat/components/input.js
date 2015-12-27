import React from 'react';
import _ from 'lodash';

export
default React.createClass({
    handelSend(e) {
        e.preventDefault();

        if (this.refs['chat-input'].value.length === 0)
            return;

        if (this.refs['chat-input'].value.startsWith('```'))
            return;

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
    render() {
        return (
            <div className="chat-input">
                <div className="chat-inner">
                	<form onSubmit={this.handelSend}>
                		<textarea wrap='soft' ref="chat-input"/>
                	 </form>
                </div>
            </div>
        );
    }
});