import React from 'react';
import _ from 'lodash';

import teamsEngineStore from '../../../../stores/teamsEngineStore';

import SidebarStore from '../Sidebar/store';

import ChatStore from './store';
import ChatActions from './actions';

export
default React.createClass({

    getInitialState() {
        var TeamEngine = teamsEngineStore.getState();
        var SelectedChannel = SidebarStore.getState().activeChannel;

        return {
            team: TeamEngine.selectedTeam ? TeamEngine.teams[TeamEngine.selectedTeam] : false,
            selectedTeam: TeamEngine.selectedTeam ? TeamEngine.selectedTeam : false,
            selectedChannel: SidebarStore.getState().activeChannel,
            messages: (TeamEngine.selectedTeam && SelectedChannel) ? TeamEngine.teams[TeamEngine.selectedTeam].messages[SelectedChannel] : false
        };
    },
    componentWillMount() {
        teamsEngineStore.listen(this.update);
        ChatStore.listen(this.update);
        SidebarStore.listen(this.update);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.update);
        ChatStore.unlisten(this.update);
        SidebarStore.unlisten(this.update);
    },
    update() {
        if (this.isMounted()) {
            var TeamEngine = teamsEngineStore.getState();
            var SelectedChannel = SidebarStore.getState().activeChannel;
            this.setState({
                team: TeamEngine.selectedTeam ? TeamEngine.teams[TeamEngine.selectedTeam] : false,
                selectedTeam: TeamEngine.selectedTeam ? TeamEngine.selectedTeam : false,
                selectedChannel: SidebarStore.getState().activeChannel,
                messages: (TeamEngine.selectedTeam && SelectedChannel) ? TeamEngine.teams[TeamEngine.selectedTeam].messages[SelectedChannel] : false
            });
        }
    },
    render() {
        return (
            <div className="page">




            </div>
        );
    }
});