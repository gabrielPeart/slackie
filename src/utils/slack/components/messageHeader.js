import React from 'react';
import moment from 'moment';

export
default React.createClass({
    render() {
    	var profileImage = (this.props.user && this.props.user.profile) ? this.props.user.profile['image_72'] : ((this.props.user && this.props.user.icons) ? this.props.user.icons[Object.keys(this.props.user.icons)[Object.keys(this.props.user.icons).length - 1]] : '');
        return (
            <div className="message">
                <img src={profileImage} className="profile" />
                <h1>{(this.props.user && this.props.user.name) ? this.props.user.name : 'Undefined'}</h1>
                <span className="time">{moment.unix(this.props.time).calendar()}</span>
            </div>
        );
    }
});

