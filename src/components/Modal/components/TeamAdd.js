import React from 'react';
import {
    Dialog
}
from 'material-ui';
import ModalStore from '../store';
import ModalActions from '../actions';



export
default class Modal extends React.Component {

    add(type) {

    }

    render() {
        return (
            <div>
                <RaisedButton secondary={true} onClick={this._handleURLAdd.bind(this)} style={{float: 'right', }} label="Stream" />
                <RaisedButton onClick={ModalActions.close} style={{float: 'right', 'marginRight': '10px' }} label="Cancel" />
            </div>
        );
    }
};