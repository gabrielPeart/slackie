import React from 'react';
import ReactDOMServer from 'react-dom/server';
import querystring from 'querystring';
import _ from 'lodash';
import emojione from 'emojione';
import ReactEmoji from 'react-emoji';
import slackdown from 'slackdown';
import moment from 'moment';



const formatText = text => {

    text = slackdown.parse(_.unescape(querystring.unescape(text)));

    return text;
}



export
default React.createClass({
    mixins: [ReactEmoji],
    render() {
        var text = this.emojify(formatText(this.props.text), {
            emojiType: 'twemoji',
            ext: 'svg',
            attributes: {
                className: 'emoji'
            }
        });
        text = text ? text : [];


        return (
            <div className="msg">
        		<div className="time">{moment.unix(this.props.ts).format('h:mm')}</div>
        		<div>
        		    {
                    	text.map((el, idx) => {
                    	    return <span key={idx} dangerouslySetInnerHTML={{__html: (React.isValidElement(el) ? ReactDOMServer.renderToString(el) : el)}} />;
                    	})
                	}
        		</div>
        	</div>
        );
    }
});