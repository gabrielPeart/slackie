import React from 'react';
import querystring from 'querystring';
import _ from 'lodash';

import teamsEngineStore from '../../../../../stores/teamsEngineStore';



export
default React.createClass({


    render() {

        var text = _.unescape(querystring.unescape(this.props.message.text));

        return (
            <p key={this.props.key}>{text}</p>
        );
    }
});