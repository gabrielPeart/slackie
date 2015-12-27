import React from 'react';
import querystring from 'querystring';
import _ from 'lodash';
import emojione from 'emojione';
import slackdown from 'slackdown';
import moment from 'moment';


emojione.imageType = 'svg';
emojione.imagePathSVG = '../images/emojione/svg/';



const formatText = text => {

    text = slackdown.parse(_.unescape(querystring.unescape(text)));

    text = emojione.shortnameToImage(text);

    return text;
}



export
default React.createClass({
    render() {
        return (
        	<div className="msg">
        		<div className="time">{moment.unix(this.props.ts).format('h:mm')}</div>
        		<div dangerouslySetInnerHTML={{__html: formatText(this.props.text)}} />
        	</div>
        );
    }
});