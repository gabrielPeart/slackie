import React from 'react';
import querystring from 'querystring';
import _ from 'lodash';
import emojione from 'emojione';
import slackdown from 'slackdown';


emojione.imageType = 'svg';
emojione.imagePathSVG = '../images/emojione/svg/';


export
default React.createClass({
    render() {
        var text = slackdown.parse(_.unescape(querystring.unescape(this.props.message.text)));

			text = emojione.shortnameToImage(text);


        return (
            <div className="msg" dangerouslySetInnerHTML={{__html: text}} />
        );
    }
});