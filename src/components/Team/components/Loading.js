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
            <div className="slack-loading">
                <p className="loading-text">Loading...</p>
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
        	</div>
        );
    }
});