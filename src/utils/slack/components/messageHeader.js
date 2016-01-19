import React from 'react';
import ImageLoader from 'react-imageloader';
import moment from 'moment';

export
default React.createClass({

    handelClick() {
        console.log("Click messageHeader", this.props);
    },

    render() {
        let profileImage = null;
        if(this.props.user && (this.props.user.profile || this.props.user.icons))
            profileImage = (this.props.user.profile) ? this.props.user.profile['image_72'] : this.props.user.icons[Object.keys(this.props.user.icons)[Object.keys(this.props.user.icons).length - 1]]
        else if(this.props.icons)
            profileImage = this.props.icons[Object.keys(this.props.icons)[Object.keys(this.props.icons).length - 1]]

        return (
            <div className="message-header" onClick={this.handelClick}>
            	<ImageLoader
                	className="profile"
                	src={profileImage || 'noavatar.jpg'} />
                <h1>{(this.props.user && this.props.user.name) ? this.props.user.name : this.props.username ? this.props.username : 'Undefined'}</h1>
                <span className="time">{moment.unix(this.props.time).calendar()}</span>
            </div>
        );
    }
});

