import React from 'react';
import ImageLoader from 'react-imageloader';
import messageFormatUtil from '../parseFormattingUtil';
import _ from 'lodash';

export
default React.createClass({
    render() {
        let text = [];

        if (this.props.mrkdwn_in && this.props.mrkdwn_in.includes('pretext'))
            text.push(<p>{this.props.pretext}</p>)

        text.push(<p dangerouslySetInnerHTML={{__html: new messageFormatUtil(_.unescape(this.props.text), this.props.users, false).parsed }}/>)

        let image = null;
        let thumb = null;

        if (this.props.thumb_url) {
            this.props.Emmiter.emit('message:loaded', false)
            thumb = <ImageLoader className="description-thumb" src={this.props.thumb_url} />; 
        }

        if (this.props.image_url) 
           image =  <ImageLoader onLoad={() => this.props.Emmiter.emit('message:loaded', true)} className="description-image" src={this.props.image_url} />;
        

        return (
            <div className="inline-description">
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