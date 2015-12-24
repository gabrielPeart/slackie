import React from 'react';
import _ from 'lodash';

import teamsEngineStore from '../../../../stores/teamsEngineStore';

import ChatStore from './store';
import ChatActions from './actions';

export
default React.createClass({

    getInitialState() {
        return {
            team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam] : false,
            selectedTeam: false,
            messages: {}
        };
    },
    componentWillMount() {
        teamsEngineStore.listen(this.update);
        ChatStore.listen(this.update);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.update);
        ChatStore.unlisten(this.update);
    },
    update() {
        if (this.isMounted()) {
            var selectedTeam = this.state.selectedTeam;
            this.setState({
                selectedTeam: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam].slack.team.id : false,
                team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam] : false,
                //messages: teamsEngineStore.getState().selectedTeam ? ChatStore.messages[teamsEngineStore.getState().selectedTeam][]
            });
            if (selectedTeam && selectedTeam !== this.state.selectedTeam);
                this.refreshListeners();
        }
    },
    refreshListeners() {
        if (!this.state.team)
            return;
        this.state.team.removeAllListeners();

        this.state.team.on('new:message', message => ChatActions.newMessage(message));
    },
    render() {
        return (
            <div className="page">




            </div>
        );
    }
});