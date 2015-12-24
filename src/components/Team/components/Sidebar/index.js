import React from 'react';
import _ from 'lodash';

import teamsEngineStore from '../../../../stores/teamsEngineStore';
import sidebarStore from './store';

let If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});

export
default React.createClass({

    getInitialState() {
        return {
            team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam].slack : false,
            active: sidebarStore.getState().activeChannel
        };
    },
    componentWillMount() {
        teamsEngineStore.listen(this.update);
        sidebarStore.listen(this.update);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.update);
        sidebarStore.unlisten(this.update);
    },
    update() {
        if (this.isMounted()) {
            this.setState({
                team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam].slack : false,
                active: sidebarStore.getState().activeChannel
            });
        }
    },

    getChannels(starred) {
        var channels = [];

        if (!this.state.team)
            return [];

        if (this.state.team && this.state.team.channels)
            _.forEach(this.state.team.channels, (channel, idx) => {
                if (starred) {
                    if (channel.is_member && !channel.is_archived && channel.is_starred)
                        channels.push(
                            <li key={idx} >
                                #{channel.name}
                            </li>
                        );
                } else {
                    if (channel.is_member && !channel.is_archived && !channel.is_starred)
                        channels.push(
                            <li key={idx} >
                                #{channel.name}
                            </li>
                        );
                }
            });
        return channels;
    },
    getDMS() {
        var dms = [];

        if (!this.state.team)
            return [];

        if (this.state.team && this.state.team.dms)
            _.forEach(this.state.team.dms, (dm, idx) => {
                if (dm.is_open && dm.is_im && !dm.is_starred)
                    dms.push(
                        <li key={idx} >
                            {dm.name}
                        </li>
                    );
            });
        return dms;
    },
    getGroups(starred) {
        var groups = [];

        if (!this.state.team)
            return [];

        if (this.state.team && this.state.team.groups)
            _.forEach(this.state.team.groups, (group, idx) => {
                if (starred) {
                    if (group.is_open && group.is_group && !group.is_archived && group.is_starred)
                        groups.push(
                            <li key={idx} >
                                {group.name}
                            </li>
                        );
                } else {
                    if (group.is_open && group.is_group && !group.is_archived && !group.is_starred)
                        groups.push(
                            <li key={idx} >
                                {group.name}
                            </li>
                        );
                }
            });
        return groups;
    },
    getStarred() {
        if (!this.state.team)
            return [];
        var starredChannels = this.getChannels(true);
        var starredGroups = this.getGroups(true);

        return [].concat(starredChannels, starredGroups);
    },
    render() {
        var Starred = this.getStarred();
        var Groups = this.getGroups();
        var Channels = this.getChannels();
        var DMs = this.getDMS();


        return (
            <aside className="sidebar">

                <If test={(Starred && Starred.length > 0)}>
                    <div>
                        <h1>Starred</h1>
                        <ul>
                            {Starred}
                        </ul>
                    </div>
                </If> 
                
                <If test={(Channels && Channels.length > 0)}>
                    <div>
                        <h1>Channels</h1>
                        <ul>
                            {Channels}
                        </ul>
                    </div>
                </If>

                <If test={(DMs && DMs.length > 0)}>
                    <div>
                        <h1>Channels</h1>
                        <ul>
                            {DMs}
                        </ul>
                    </div>
                </If>
                
                <If test={(Groups && Groups.length > 0)}>
                    <div>
                        <h1>Direct Messages</h1>
                        <ul>
                            {Groups}
                        </ul>
                    </div>
                </If>
            </aside>
        );
    }
});