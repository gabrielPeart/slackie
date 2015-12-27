import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import ChatStore from './store';
import ChatActions from './actions';
import Input from './components/input';

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
        this.refs['messages'].scrollTop = this.refs['messages'].scrollHeight;

    },

    render() {
        _.defer(this.scrollBottom);
        return (
            <div className="page">
                <div className="header">
                    <h1>{this.props.name}</h1>
                    <span>{this.props.topic ? this.props.topic[0] : ''}</span>
                </div>

                <div ref="messages" className="messages">
                    {this.props.messages}
                </div>
            
                <Input />
            </div>
        );
    }
});