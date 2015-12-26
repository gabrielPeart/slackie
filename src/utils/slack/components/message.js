import React from 'react';
import querystring from 'querystring';
import _ from 'lodash';




export
default React.createClass({
    render() {
        var text = _.unescape(querystring.unescape(this.props.message.text));
        return (
            <p>{text}</p>
        );
    }
});