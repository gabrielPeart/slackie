import React from 'react';
import _ from 'lodash';

import ChatStore from './store';
import ChatActions from './actions';

export
default React.createClass({
    render() {
        return (
            <div className="page">
                <div className="header">
                    <h1>#general</h1>
                </div>

                <div className="messages">
                    {this.props.messages}
                </div>
            
                <div className="chat-input">
                </div>
            </div>
        );
    }
});