import React from 'react';
import _ from 'lodash';

export
default React.createClass({
    handelSend(e) {
        e.preventDefault();

        if (this.refs['chat-input'].value.length === 0)
            return;

        let channel = this.props.team.getChannelGroupOrDMByID(this.props.channel.id);
        channel.send(this.refs['chat-input'].value);



        this.refs['chat-input'].value = '';

    },
    render() {
        return (
            <div className="chat-input">
                <div className="chat-inner">
                	<form onSubmit={this.handelSend}>
                		<input ref="chat-input"/>
                	 </form>
                </div>
            </div>
        );
    }
});