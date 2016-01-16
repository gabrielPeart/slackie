import React from 'react';
import {v1 as uuid} from 'node-uuid';
import ImageLoader from 'react-imageloader';
import messageFormatUtil from '../parseFormattingUtil';
import _ from 'lodash';

export
default React.createClass({

    handelLoaded() {
        this.props.Emmiter.emit('message:loaded', true);
    },
    
    render() {
        let text = [];

        if (this.props.mrkdwn_in && this.props.mrkdwn_in.includes('pretext'))
            text.push(<p key={uuid()}>{this.props.pretext}</p>)

        text.push(<p key={uuid()} dangerouslySetInnerHTML={{__html: new messageFormatUtil(_.unescape(this.props.text), this.props.users, false).parsed }}/>)

        let image = null;
        let thumb = null;

        if (this.props.thumb_url) {
            this.props.Emmiter.emit('message:loaded', false)
            thumb = <ImageLoader className="description-thumb" src={this.props.thumb_url} />; 
        }

        if (this.props.image_url) 
           image = <ImageLoader onLoad={this.handelLoaded} className="description-image" src={this.props.image_url} />;
        

        return (
            <div key={uuid()} className="inline-description">
                {thumb}
                <span className={this.props.thumb_url ? 'thumb' : ''}>
                    <h2>{this.props.service_name}</h2>
                    <a className="description-title" href={this.props.title_link}>{this.props.title}</a>
                    {text}
                </span>
                {image}
            </div>
        );
    }
});