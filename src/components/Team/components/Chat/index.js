import React from 'react';
import _ from 'lodash';

import ChatStore from './store';
import ChatActions from './actions';

export
default React.createClass({

    componentDidMount() {
        window.addEventListener('resize', this.scrollBottom);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.scrollBottom);
    },

    scrollBottom() {
        if (!this.refs['messages'])
            return;

        console.log(this.refs['messages'].scrollHeight, this.refs['messages'].scrollTop)

        this.refs['messages'].scrollTop = this.refs['messages'].scrollHeight;

    },

    render() {
        _.defer(this.scrollBottom);

        return (
            <div className="page">
                <div className="header">
                    <h1>#general</h1>
                </div>

                <div ref="messages" className="messages">
                    {this.props.messages}
                </div>
            
                <div className="chat-input">
                </div>
            </div>
        );
    }
});