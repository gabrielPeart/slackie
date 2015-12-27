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

        var node = this.refs['messages'];
        node.scrollTop = node.scrollHeight;
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.scrollBottom);
    },

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            var node = this.refs['messages'];
            node.scrollTop = node.scrollHeight
        }
    },

    componentWillUpdate() {
        if (!this.refs['messages'])
            return;
        var node = this.refs['messages'];
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
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