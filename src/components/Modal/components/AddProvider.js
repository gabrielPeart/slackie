import React from 'react';
import {
    RaisedButton
}
from 'material-ui';

import ModalActions from '../actions';

export
default React.createClass({

    componentDidMount() {
    },

    render() {
        return (
            <div>
                <RaisedButton secondary={true} onClick={this.handleURLAdd} style={{float: 'right', }} label="Slack" />
                <RaisedButton secondary={true} onClick={this.handleURLAdd} style={{float: 'right', }} label="IRC" />
                <RaisedButton onClick={ModalActions.close} style={{float: 'right', 'marginRight': '10px' }} label="Cancel" />
            </div>
        );
    }
});