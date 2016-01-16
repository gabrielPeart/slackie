import React from 'react';
import _ from 'lodash';

import SidebarStore from './store';
import SidebarActions from './actions';


const If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});

const SidebarTab = React.createClass({
    getInitialState() {
        return {
            activeChannel: SidebarStore.getState().activeChannel[this.props.slack]
        };
    },
    componentWillMount() {
        SidebarStore.listen(this.update);
    },
    componentWillUnmount() {
        SidebarStore.unlisten(this.update);
    },
    update() {
        if (this.isMounted()) {
            this.setState({
                activeChannel: SidebarStore.getState().activeChannel[this.props.slack]
            });
        }
    },
    handelSelect(channel) {
        if(!this.state.activeChannel || this.state.activeChannel.id !== channel.id)
            SidebarActions.setActive({
                team: this.props.slack, 
                channel: channel
            });
    },
    render() {
        return (
            <li key={this.props.key} className={((this.state.activeChannel && this.state.activeChannel.id) === this.props.id) ? 'active': ''} onClick={this.handelSelect.bind(this, _.omit(this.props, 'slack'))} >
                <i className={'user-status ' + (this.props.is_im ? this.props.users[this.props.user].presence : 'hidden')} />
                {this.props.is_channel ? ('#' + this.props.name) : this.props.name}
            </li>
        );
    }
});


export
default React.createClass({
    getChannels(starred) {
        const team = this.props.team.slack;
        var channels = [];

        if (team.channels)
            _.forEach(team.channels, (channel, idx) => {
                if (starred) {
                    if (channel.is_member && !channel.is_archived && channel.is_starred) {
                        channels.push(
                            <SidebarTab key={idx} slack={this.props.team.slack.team.id} {...channel} />
                        );
                    }
                } else {
                    if (channel.is_member && !channel.is_archived && !channel.is_starred) {
                        channels.push(
                            <SidebarTab key={idx} slack={this.props.team.slack.team.id} {...channel} />
                        );
                    }
                }
            });
        return channels;
    },
    getDMS() {
        const team = this.props.team.slack;
        var dms = [];

        if (team.dms)
            _.forEach(team.dms, (dm, idx) => {
                if (dm.is_open && dm.is_im)
                    dms.push(
                        <SidebarTab key={idx} slack={this.props.team.slack.team.id} users={this.props.team.slack.users} {...dm} />
                    );
            });
        return dms;
    },
    getGroups(starred) {
        const team = this.props.team.slack;
        var groups = [];

        if (team.groups)
            _.forEach(team.groups, (group, idx) => {
                if (starred) {
                    if (group.is_open && group.is_group && !group.is_archived && group.is_starred)
                        groups.push(
                            <SidebarTab slack={this.props.team.slack.team.id} key={idx} {...group} />
                        );
                } else {
                    if (group.is_open && group.is_group && !group.is_archived && !group.is_starred)
                        groups.push(
                            <SidebarTab slack={this.props.team.slack.team.id} key={idx} {...group} />
                        );
                }
            });
        return groups;
    },
    getStarred() {
        const starredChannels = this.getChannels(true);
        const starredGroups = this.getGroups(true);

        return [].concat(starredChannels, starredGroups);
    },
    render() {
        const Starred = this.getStarred();
        const Groups = this.getGroups();
        const Channels = this.getChannels();
        const DMs = this.getDMS();
        return (
            <aside className="sidebar">
                <div className="team-title">{this.props.team.slack.team.name}</div>
                <div className="team-user">
                    <i className={"user-status " + (this.props.team.slack.self.manual_presence ? 'active' : 'away')}/>
                    <p>{this.props.team.slack.self.name}</p>
                </div>

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
                        <h1>Direct Messages</h1>
                        <ul>
                            {DMs}
                        </ul>
                    </div>
                </If>
                
                <If test={(Groups && Groups.length > 0)}>
                    <div>
                        <h1>Groups</h1>
                        <ul>
                            {Groups}
                        </ul>
                    </div>
                </If>
            </aside>
        );
    }
});