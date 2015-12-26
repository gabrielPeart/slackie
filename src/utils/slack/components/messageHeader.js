import React from 'react';
import moment from 'moment';

export
default React.createClass({
    render() {
        return (
            <div className="message">
                <img src={(this.props.user && this.props.user.profile) ? this.props.user.profile['image_72'] : ''} className="profile" />
                <h1>{(this.props.user && this.props.user.name) ? this.props.user.name : 'Undefined'}</h1>
                <span className="time">{moment.unix(this.props.time).calendar()}</span>
            </div>
        );
    }
});