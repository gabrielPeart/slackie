import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ImageLoader from 'react-imageloader';
import querystring from 'querystring';
import _ from 'lodash';
import messageFormatUtil from '../parseFormattingUtil';
import moment from 'moment';

import InlineImage from './inlineImage';
import InlineDescription from './inlineDescription';

const If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});

export
default React.createClass({
    getInitialState() {
        return {
            subtype: this.props.subtype,
            attachments: this.props.attachments,
            file: this.props.file,
            text: this.props.text,
            time: this.props.ts,
            edited: false,
            removed: false
        };
    },

    componentWillMount() {
        this.handelListenEvents();
    },
    componentDidMount() {
        this.props.Emmiter.emit('message:loaded')  
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
            case 'message_deleted':
                this.setState({
                    subtype: 'removed',
                    removed: true
                });
                break;
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
            edited: edit.edited ? true : false,
        });

        _.defer(() =>{
            this.props.Emmiter.emit('message:loaded');
            this.handelListenEvents();
        });
    },

    handelInLineToggle() {
        this.setState({
            attachmentExpanded: !this.state.attachmentExpanded
        });
        this.props.Emmiter.emit('inline:toggle');
    },

    getInline() {
        let inline = [];
        switch (this.state.subtype) {
            case 'file_share':
                const file = this.state.file;
                if(file.mimetype.includes('image/'))
                	inline.push(<InlineImage Emmiter={this.props.Emmiter} {...this.state.file} />);

                break;
            default:
            	if(!this.state.attachments || !this.state.attachments.length > 0)
            		return inline;
            	const attachment = this.state.attachments[0];

            	if(!attachment.text && attachment.image_url){
                	inline.push(<InlineImage Emmiter={this.props.Emmiter} {...attachment} />);
            	}
              	else if(attachment.text){
              		inline.push(<InlineDescription Emmiter={this.props.Emmiter} {...attachment} />);
              	}                               
        }

        return inline;
    },

    getClassName() {
        switch (this.state.subtype) {
            case 'channel_join':
            case 'channel_leave':
            case 'channel_purpose':
            case 'channel_topic':
                return 'channel_event';
                break;
            case 'me_message':
                return 'me_message';
                break;
            default:
                return this.state.subtype;
        }
    },

    handelClick() {
        console.log("Click message", this.state);
    },

    render() {
        const text = new messageFormatUtil(_.unescape(this.state.text), this.props.users, false).parsed;
        const removedProps = this.props.removed || {};
        const removed = this.state.removed || (removedProps[this.props.channel] && removedProps[this.props.channel].includes(this.props.user + ':' + this.props.ts));

        const inline = this.getInline();
        
        const edited = (this.state.edited && !removed) ? <div className="edited">(edited)</div> : null

        return (
            <div onClick={this.handelClick} className={'message ' + (this.state.removed ? 'removed' : '')}>
        		<div className="time">{moment.unix(this.state.time).format('h:mm')}</div> 
                <span className={this.getClassName()} dangerouslySetInnerHTML={{__html: removed ? 'Message removed.' : text }} />
                {inline}
                {edited}
        	</div>
        );
    }
});