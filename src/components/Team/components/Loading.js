import React from 'react';
import _ from 'lodash';

export
default React.createClass({
    getInitialState() {
        return {

        };
    },

    render() {
        return (
            <div className={'slack-loading' + (this.props.team && this.props.channel ? ' chat' : '' )}>
                <p className="loading-text">Loading...</p>
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
        	</div>
        );
    }
});