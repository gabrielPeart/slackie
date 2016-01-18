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
        let image = null, thumb = null, title = null;

        if (this.props.thumb_url) {
            this.props.Emmiter.emit('message:loaded', false);
            thumb = <ImageLoader className="description-thumb" src={this.props.thumb_url} />; 
        }

        if (this.props.image_url) 
           image = <ImageLoader onLoad={this.handelLoaded} className="description-image" src={this.props.image_url} />;

        if (this.props.title) {
            title = this.props.title_link ?
                <a className="description-title" href={this.props.title_link}>{this.props.title}</a> :
                <div className="description-title">{this.props.title}</div>;
        }

        return (
            <div className="inline-container">
                <div className="color-bar" style={{backgroundColor: (this.props.color ? ('#' + this.props.color) : void 0)}}></div>
                <div className="inline-description">
                    {thumb}
                    <div className={'inline-description-inner ' + (this.props.thumb_url ? 'thumb' : '')}>
                        {this.props.service_name ? <h2>this.props.service_name</h2> : ''}
                        {title}
                        <p dangerouslySetInnerHTML={{__html: new messageFormatUtil(_.unescape(this.props.text).trim(), this.props.users, false).parsed }}/>
                    </div>
                    {image}
                </div>
            </div>
        );
    }
});