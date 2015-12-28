import React from 'react';
import ReactDOMServer from 'react-dom/server';
import querystring from 'querystring';
import _ from 'lodash';
import ReactEmoji from 'react-emoji';
import slackdown from 'slackdown';
import moment from 'moment';

const If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});

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
            time: this.props.ts,
            edited: false,
            visible: false
        };
    },

    componentDidMount() {
        this.handelListenEvents();
        _.defer(() => {
            this.setState({
                visible: true
            });
        })

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
            time: edit.ts,
            edited: true
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

        var className = (this.props.subtype && this.props.subtype === 'me_message') ? 'me_message' : '';

        return (
            <div className="msg">
        		<div className="time">{moment.unix(this.state.time).format('h:mm')}</div> 
        		{
                   	text.map((el, idx) => {
                   	    return (
                   	    	<span key={idx}>
                   	    		<span className={className} dangerouslySetInnerHTML={{__html: (React.isValidElement(el) ? ReactDOMServer.renderToString(el) : el)}} />
                   	    	</span>
                   	    );
                   	})
                }
                <If test={this.state.edited}>
                	<div className="edited">(edited)</div>
                </If>
        	</div>
        );
    }
});