import React from 'react';
import ImageLoader from 'react-imageloader';
import messageFormatUtil from '../parseFormattingUtil';
import _ from 'lodash';
import {v4 as uuid} from 'node-uuid';

export
default React.createClass({

    componentDidMount() {
        this.props.Emmiter.emit('message:loaded'); 
    },

    handelLoaded() {
        this.props.Emmiter.emit('message:loaded', true);
    },

    handelClick() {
        console.log("Click inlineDescription", this.state);
    },
    
    render() {
        let image = null, thumb = null, title = null, fields = null;

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

        if (this.props.fields) {
            let out = []
            _.forEach(this.props.fields, field => out.push(
                <div key={uuid()} className={'field ' + (field.short ? 'short' : '')}>
                    <h3>{field.title || ''}</h3>
                    <p>{field.value || ''}</p>
                </div>
            ));
            fields = <div className='fields'>{out}</div>;
        }

        return (
            <div className="inline-container" onClick={this.handelClick}>
                <div className="color-bar" style={{backgroundColor: (this.props.color ? ('#' + this.props.color) : void 0)}}></div>
                <div className={"inline-description " + (this.props.thumb_url ? 'thumb' : '')}>
                    {thumb}
                    <div className='inline-description-inner'>
                        {this.props.service_name ? <h2>this.props.service_name</h2> : ''}
                        {title}
                        <p dangerouslySetInnerHTML={{__html: new messageFormatUtil(_.unescape(this.props.text).trim(), this.props.users, false).parsed }}/>
                        {fields}
                    </div>
                    {image}
                </div>
            </div>
        );
    }
});