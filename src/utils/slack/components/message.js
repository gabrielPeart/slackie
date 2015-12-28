import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ImageLoader from 'react-imageloader';
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
            subtype: this.props.subtype,
            attachments: this.props.attachments,
            file: this.props.file,
            text: this.props.text,
            time: this.props.ts,
            edited: false,
            attachmentExpanded: true
        };
    },

    componentWillMount() {
        this.handelListenEvents();
    },

    componentWillUnmount() {
        this.handelUnlistenEvents();
    },

    handelUnlistenEvents() {
        this.props.Emmiter.removeAllListeners(this.props.channel + ':' + this.props.user + ':' + this.state.time);
    },

    handelListenEvents() {
        this.props.Emmiter.on(this.props.channel + ':' + this.props.user + ':' + this.state.time, this.handelMessageEvents);
    },

    handelMessageEvents(event) {
        this.handelUnlistenEvents();
        switch (event.subtype) {
            case 'message_changed':
                this.handelEdit(event.message, event.subtype);
                break;
            default:
                this.handelListenEvents();
        }
    },

    handelEdit(edit, subtype) {
        this.setState({
            subtype: subtype,
            attachments: edit.attachments ? edit.attachments : false,
            file: edit.file ? edit.file : false,
            text: edit.text,
            time: edit.ts,
            edited: edit.edited ? true : false
        });
        _.defer(this.handelListenEvents);
    },

    handelInLineToggle() {
        this.setState({
            attachmentExpanded: !this.state.attachmentExpanded
        });
        this.props.Emmiter.emit('inline:toggle');
    },

    handelMessageLoaded(inline) {
        if (inline)
            _.delay(() => this.props.Emmiter.emit('message:loaded', inline, this.state.time), 300);
        else
            this.props.Emmiter.emit('message:loaded', inline, this.state.time);
    },

    getInline() {
        switch (this.state.subtype) {
            case 'file_share':
                if (this.state.file && this.state.file.mimetype && this.state.file.mimetype.includes('image'))
                    return (
                        <span>
                			<i onClick={this.handelInLineToggle} className={"toggle-inline " + (this.state.attachmentExpanded ? 'ion-arrow-down-b' : 'ion-arrow-right-b')} />
                			<ImageLoader
                				onLoad={this.handelMessageLoaded.bind(this,true)}
                				className={"inline-image " + this.state.attachmentExpanded}
                			 	src={this.state.file.url} />
                		</span>
                    );
                break;
            default:
                if (this.state.attachments && this.state.attachments[0] && this.state.attachments[0].image_url)
                    return (
                        <span>
                			<i onClick={this.handelInLineToggle} className={"toggle-inline " + (this.state.attachmentExpanded ? 'ion-arrow-down-b' : 'ion-arrow-right-b')} />
                            <ImageLoader
                                onLoad={this.handelMessageLoaded.bind(this,true)}
                                className={"inline-image " + this.state.attachmentExpanded}
                                src={this.state.attachments[0].image_url} />
                		</span>
                    );
                this.handelMessageLoaded(false);
                return null;
        }
    },

    getClassName() {
        switch (this.state.subtype) {
            case 'me_message':
                return 'me_message';
                break;
            default:
                return '';
        }
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
        		{
                   	text.map((el, idx) => {
                   	    return <span key={idx} className={this.getClassName()} dangerouslySetInnerHTML={{__html: (React.isValidElement(el) ? ReactDOMServer.renderToString(el) : el)}} />;
                   	})
                }
                {this.getInline()}
                <If test={this.state.edited}>
                	<div className="edited">(edited)</div>
                </If>
        	</div>
        );
    }
});