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
import {
    app
}
from 'remote';

import commonUtil from '../utils/commonUtil';
import Team from '../utils/slack/teamUtil';

import Header from './Header';
import TeamSelector from './TeamSelector';
import TeamSelectorActions from './TeamSelector/actions';

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
        const TeamsPath = path.join(app.getPath('userData'), 'teams.json');
        
        commonUtil.readJson(TeamsPath)
            .then(teams => {
                _.forEach(teams, team => {
                    let SlackTeam = new Team(team.token, team.meta);
                    SlackTeam.on('logged-in', () => TeamSelectorActions.added(SlackTeam));

                    SlackTeam.on('meta-refreshed', meta => {
                        TeamSelectorActions.meta({
                            id: SlackTeam.slack.team.id,
                            meta: meta
                        });
                        commonUtil.readJson(TeamsPath)
                            .then((json = {}) => {
                                json[SlackTeam.slack.team.id] = {
                                    meta: meta,
                                    token: SlackTeam.slack.token
                                };
                                commonUtil.saveJson(TeamsPath, json)
                            }).catch(() => {
                                var json = {};
                                json[SlackTeam.slack.team.id] = {
                                    meta: meta,
                                    token: SlackTeam.slack.token
                                };
                                commonUtil.saveJson(TeamsPath, json)
                            });
                    });
                });
            })
            .catch();
    },

    componentWillUnmount() {},

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