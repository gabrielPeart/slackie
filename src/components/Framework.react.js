import React from 'react';
import path from 'path';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
    RouteContext
}
from 'react-router';
import {
    mouseTrap
}
from 'react-mousetrap';
import {
    ipcRenderer
}
from 'electron';

import TeamsUtil from '../utils/teamUtil';

import updaterActions from '../actions/updateActions';
import analyticsActions from '../actions/analyticsActions';

import Header from './Header';
import TeamSelector from './TeamSelector';
import Modal from './Modal';


const Framework = React.createClass({

    mixins: [PureRenderMixin, RouteContext],

    getInitialState() {
        return {
            updateChecked: false
        };
    },

    componentWillMount() {
        this.props.bindShortcut('ctrl+d', () => ipcRenderer.send('app:toggleDevTools'));
    },

    componentDidMount() {
       TeamsUtil.reload();
    },

    componentWillUnmount() {},

    update() {
        if (this.isMounted()) {
            this.setState({
                
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
              <Modal/>
            </div>
        );
    }
});


export
default mouseTrap(Framework)