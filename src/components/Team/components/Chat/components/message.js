import React from 'react';

import teamsEngineStore from '../../../../../stores/teamsEngineStore';



export
default React.createClass({


    render() {
        return (
            <p key={this.props.key} >{this.props.message.text}</p>
        );
    }
});