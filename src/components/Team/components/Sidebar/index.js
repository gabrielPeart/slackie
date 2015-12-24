import React from 'react';
import _ from 'lodash';

import teamsEngineStore from '../../../../stores/teamsEngineStore';
import SidebarStore from './store';
import SidebarActions from './actions';

const If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});

const SidebarTab = React.createClass({
    handelSelect(id) {
        SidebarActions.setActive(id);
    },
    render() {
        return (
            <li key={this.props.key} onClick={this.handelSelect.bind(this, this.props.id)} >
                {this.props.name}
            </li>
        );
    }
});


export
default React.createClass({

    getInitialState() {
        return {
            team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam].slack : false,
            active: SidebarStore.getState().activeChannel
        };
    },
    componentWillMount() {
        teamsEngineStore.listen(this.update);
        SidebarStore.listen(this.update);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.update);
        SidebarStore.unlisten(this.update);
    },
    update() {
        if (this.isMounted()) {
            this.setState({
                team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam].slack : false,
                active: SidebarStore.getState().activeChannel
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
                    if (channel.is_member && !channel.is_archived && channel.is_starred) {
                        channels.push(
                            <SidebarTab key={idx} id={channel.id} name={'#'+channel.name} />
                        );
                    }
                } else {
                    if (channel.is_member && !channel.is_archived && !channel.is_starred) {
                        channels.push(
                            <SidebarTab key={idx} id={channel.id} name={'#'+channel.name} />
                        );
                    }
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
                        <SidebarTab key={idx} id={dm.id} name={dm.name} />
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
                            <SidebarTab key={idx} id={group.id} name={group.name} />
                        );
                } else {
                    if (group.is_open && group.is_group && !group.is_archived && !group.is_starred)
                        groups.push(
                            <SidebarTab key={idx} id={group.id} name={group.name} />
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