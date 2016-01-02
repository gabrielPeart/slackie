import React from 'react';
import ImageLoader from 'react-imageloader';
import moment from 'moment';

export
default React.createClass({
    render() {
    	var profileImage = (this.props.user && this.props.user.profile) ? this.props.user.profile['image_72'] : ((this.props.user && this.props.user.icons) ? this.props.user.icons[Object.keys(this.props.user.icons)[Object.keys(this.props.user.icons).length - 1]] : '');
        return (
            <div className="message">
            	<ImageLoader
                	className="profile"
                	src={profileImage} />
                <h1>{(this.props.user && this.props.user.name) ? this.props.user.name : 'Undefined'}</h1>
                <span className="time">{moment.unix(this.props.time).calendar()}</span>
            </div>
        );
    }
});

