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

    getInitialState() {
        return {
            text: this.props.text,
            time: this.props.ts
        };
    },

    componentDidMount() {
        this.handelListenEvents();
    },

    componentWillUnmount() {
        this.handelUnlistenEvents();
    },

    handelUnlistenEvents() {
        this.props.Emmiter.removeAllListeners(this.props.channel + ':' + this.props.user + ':' + this.state.time + ':' + this.state.text);
    },

    handelListenEvents() {
        this.props.Emmiter.on(this.props.channel + ':' + this.props.user + ':' + this.state.time + ':' + this.state.text, this.handelMessageEvents);
    },

    handelMessageEvents(event) {
        this.handelUnlistenEvents();
        switch (event.subtype) {
            case 'message_changed':
                this.handelEdit(event.message);
                break;
            default:
                this.handelListenEvents();
        }
    },

    handelEdit(edit) {
        this.setState({
            text: edit.text,
            time: edit.ts
        });
        _.defer(this.handelListenEvents);
    },


    render() {
        var text = this.emojify(formatText(this.state.text), {
            emojiType: 'twemoji',
            ext: 'svg',
            attributes: {
                className: 'emoji'
            }
        });
        text = text ? text : [];

        return (
            <div className="msg">
        		<div className="time">{moment.unix(this.state.time).format('h:mm')}</div>
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