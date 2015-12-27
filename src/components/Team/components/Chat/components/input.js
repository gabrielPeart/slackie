import React from 'react';
import _ from 'lodash';

export
default React.createClass({
	handelSend(e){
		e.preventDefault();
		
		let channel = this.props.team.getChannelGroupOrDMByID(this.props.channel.id);
		console.log(channel)

	},
	render() {
		return (
			<div className="chat-input">
                <div className="chat-inner">
                	<form onSubmit={this.handelSend}>
                		<input/>
                	 </form>
                </div>
            </div>
		);
	}
});