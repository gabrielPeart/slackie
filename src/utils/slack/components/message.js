import React from 'react';
import querystring from 'querystring';
import _ from 'lodash';
import slackdown from 'slackdown';
slackdown.parse('The quick brown fox jumps over the lazy dog')




export
default React.createClass({
    render() {
        var text = _.unescape(querystring.unescape(this.props.message.text));
        return (
            <div className="msg" dangerouslySetInnerHTML={{__html: slackdown.parse(text)}} />
        );
    }
});