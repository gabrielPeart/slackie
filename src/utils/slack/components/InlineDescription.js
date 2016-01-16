import React from 'react';
import ImageLoader from 'react-imageloader';
import messageFormatUtil from '../parseFormattingUtil';
import _ from 'lodash';

export
default React.createClass({

    componentDidMount() {
        this.props.Emmiter.emit('message:loaded'); 
    },

    handelLoaded() {
        this.props.Emmiter.emit('message:loaded', true);
    },
    
    render() {
        let image = null;
        let thumb = null;

        if (this.props.thumb_url) {
            this.props.Emmiter.emit('message:loaded', false)
            thumb = <ImageLoader className="description-thumb" src={this.props.thumb_url} />; 
        }

        if (this.props.image_url) 
           image = <ImageLoader onLoad={this.handelLoaded} className="description-image" src={this.props.image_url} />;
        return (
            <div className="inline-description">
                <div className="color-bar" style={{backgroundColor: (this.props.color ? ('#' + this.props.color) : void 0)}}></div>
                {thumb}
                <div className={this.props.thumb_url ? 'inline-description-inner thumb' : 'inline-description-inner'}>
                    <h2>{this.props.service_name}</h2>
                    <a className="description-title" href={this.props.title_link}>{this.props.title}</a>
                    <p dangerouslySetInnerHTML={{__html: new messageFormatUtil(_.unescape(this.props.text), this.props.users, false).parsed }}/>
                </div>
                {image}
            </div>
        );
    }
});