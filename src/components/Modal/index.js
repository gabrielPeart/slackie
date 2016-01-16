import React from 'react';
import {
    Dialog
}
from 'material-ui';
import ModalStore from './store';
import ModalActions from './actions';

import TeamAdd from './components/TeamAdd';


export
default class Modal extends React.Component {
    constructor() {
        super();
        this.state = {
            type: false,
            open: false
        }

    }

    componentDidMount() {
        ModalStore.listen(this._update);
    }

    componentWillUnmount() {
        ModalStore.unlisten(this._update);
    }

    _update() {
        this.setState(ModalStore.getState());
    }

    _getStyle(type) {
        switch (type) {
            case 'TeamAdd':
                return {
                    height: '200px'
                };
            default:
                return {};
        }
    }

    _getContents(type) {
        switch (type) {
            case 'TeamAdd':
                return <TeamAdd />;
                break;
            case 'IRCAdd':
                return <IRCAdd />;
                break;
            default:
                return null;
        }
    }

    render() {
        const type = this.state.type ? this.state.type : false;
        return ( 
            <Dialog 
                style={this._getStyle.bind(this, type)()}
                open={this.state.open}
                autoScrollBodyContent={true}
                contentClassName="material-dialog"
                onRequestClose={() => this.setState({open: false})} > 
                {this._getContents.bind(this, type)()} 
            </Dialog>
        );
    }
};