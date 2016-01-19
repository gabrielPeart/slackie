import React from 'react';
import ImageLoader from 'react-imageloader';
import moment from 'moment';

export
default React.createClass({

    handelClick() {
        console.log("Click messageHeader", this.props);
    },

    render() {

        const profileImage = (this.props.user && this.props.user.profile) ? 
            this.props.user.profile.image_72 :
            (this.props.user && this.props.user.icons) ?
                this.props.user.icons[Object.keys(this.props.user.icons)[Object.keys(this.props.user.icons).length - 1]] : 
                (this.props.icons && this.props.icons.image_64) ?
                    this.props.icons.image_64 :
                    'null';

        return (
            <div className="message-header" onClick={this.handelClick}>
            	<ImageLoader
                	className="profile"
                	src={profileImage ? profileImage : void 0} />
                <h1>{(this.props.user && this.props.user.name) ? this.props.user.name : this.props.username ? this.props.username : 'Undefined'}</h1>
                <span className="time">{moment.unix(this.props.time).calendar()}</span>
            </div>
        );
    }
});

