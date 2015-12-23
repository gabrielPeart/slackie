import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
    RouteContext
}
from 'react-router';
import _ from 'lodash';
import {
    mouseTrap
}
from 'react-mousetrap';
import {
    ipcRenderer
}
from 'electron';

import Header from './Header';
import TeamSelector from './TeamSelector';

import updaterActions from '../actions/updateActions';
import analyticsActions from '../actions/analyticsActions';

const Framework = React.createClass({

    mixins: [PureRenderMixin, RouteContext],

    getInitialState() {
        return {
            updateChecked: false
        };
    },

    componentWillMount() {
        this.props.bindShortcut('ctrl+d', () => {
            ipcRenderer.send('app:toggleDevTools');
        });
    },

    componentDidMount() {
    },

    componentWillUnmount() {
    },

    update() {
        if (this.isMounted()) {
            this.setState({
                online: NetworkStore.getState().online
            });

            _.defer(() => {
                if (!this.state.updateChecked && this.state.online) {
                    this.setState({
                        updateChecked: true
                    });
                    analyticsActions.send('dashboard');
                    updaterActions.check();
                    NetworkStore.unlisten(this.update);
                }
            });
        }
    },

    render() {
        return (
            <div className="full-contain">
              <Header/>
              <TeamSelector/>
              <div className="main">
              	{React.cloneElement(this.props.children, {query: this.props.query})}
              </div>
            </div>
        );
    }
});


export
default mouseTrap(Framework)