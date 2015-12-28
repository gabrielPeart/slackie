import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import ChatStore from './store';
import ChatActions from './actions';
import Input from './components/input';

export
default React.createClass({

    componentDidMount() {
        window.addEventListener('resize', this.checkAndSroll);
        this.refs['messages'].scrollTop = this.refs['messages'].scrollHeight;
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkAndSroll);
    },

    componentDidUpdate() {
        this.checkAndSroll();
        this.refreshListeners();
    },

    componentWillUpdate() {
        if (!this.refs['messages'])
            return;
        this.shouldScrollBottom = this.refs['messages'].scrollTop + this.refs['messages'].offsetHeight === this.refs['messages'].scrollHeight;
    },

    checkAndSroll() {
        if (this.shouldScrollBottom) {
            this.refs['messages'].scrollTop = this.refs['messages'].scrollHeight;
        }
    },

    refreshListeners() {
        if (!this.props.emitter)
            return;

        this.props.emitter.removeAllListeners('message:loaded');
        var lastTime = 0;
        var throttle = _.throttle((inline, time) => _.defer(this.checkAndSroll), 300);
        this.props.emitter.on('message:loaded', throttle);
    },

    render() {
        return (
            <div className="page">
                <div className="header">
                    <h1>{this.props.name}</h1>
                    <span>{this.props.topic ? this.props.topic[0] : ''}</span>
                </div>
                <div ref="messages" className="messages">
                    {
                        this.props.messages.map((el, idx) => {
                            return(
                                <span key={idx}>
                                    {el}
                                </span>
                            );
                        })
                    }
                </div>
                <Input {...this.props} />
            </div>
        );
    }
});