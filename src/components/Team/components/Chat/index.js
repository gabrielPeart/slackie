import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import ChatStore from './store';
import ChatActions from './actions';
import Input from './components/input';

export
default React.createClass({

    componentWillMount() {
        this.shouldScrollBottom = true;
    },

    componentDidMount() {
        window.addEventListener('resize', this.checkAndSroll);
        this.refs['messages'].scrollTop = this.refs['messages'].scrollHeight;
        this.refreshListeners();
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkAndSroll);
    },

    componentDidUpdate() {
        if (this.shouldScrollBottom)
            this.refs['messages'].scrollTop = this.refs['messages'].scrollHeight;
    },

    handelScroll() {
        if (!this.refs['messages'])
            return;

        this.shouldScrollBottom = this.refs['messages'].scrollTop + this.refs['messages'].offsetHeight >= this.refs['messages'].scrollHeight - 15;
    },

    refreshListeners() {
        if (!this.props.emitter)
            return;

        this.props.emitter.removeAllListeners('message:loaded');
        this.props.emitter.removeAllListeners('inline:toggle');

        this.props.emitter.on('inline:toggle', () => {
            if (!this.refs['messages']) return;

            if (this.shouldScrollBottom) 
                _.defer(() => this.refs['messages'].scrollTop = this.refs['messages'].scrollHeight)
        });
        this.props.emitter.on('message:loaded', () => {
            if (!this.refs['messages']) return;

            if (this.shouldScrollBottom) 
                _.defer(() => this.refs['messages'].scrollTop = this.refs['messages'].scrollHeight)
        });
    },


    render() {
        let messages = []
        _.forEach(this.props.messages, msg => messages.push(msg));
        return (
            <div className="page">
                <div className="header">
                    <h1>{this.props.name}</h1>
                    <div className="topic-container">
                        <span className="topic-inner">{_.unescape(this.props.topic ? this.props.topic[0] : '')}</span>
                    </div>
                </div>
                <div ref="messages" onWheel={this.handelScroll} className="messages">
                    {messages}
                </div>
                <Input {...this.props} />
            </div>
        );
    }
});