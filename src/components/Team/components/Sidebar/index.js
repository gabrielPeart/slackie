import React from 'react';
import _ from 'lodash';
import teamsEngineStore from '../../../../stores/teamsEngineStore';


let If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});

export
default React.createClass({

    getInitialState() {
        return {
            team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam].api : false
        };
    },
    componentWillMount() {
        teamsEngineStore.listen(this.update);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.update);
    },
    update() {
        if (this.isMounted()) {
            this.setState({
                team: teamsEngineStore.getState().selectedTeam ? teamsEngineStore.getState().teams[teamsEngineStore.getState().selectedTeam].api : false
            });
        }
    },

    getChannels() {
        var channels = [];
        if (this.state.team && this.state.team.channels)
            _.forEach(this.state.team.channels, (channel, idx) => {
                if (channel.is_member && !channel.is_archived)
                    channels.push(
                        <li key={idx} >
                            #{channel.name}
                        </li>
                    );
            });
        return channels;
    },
    getDMS() {
        var dms = [];
        if (this.state.team && this.state.team.dms)
            _.forEach(this.state.team.dms, (dm, idx) => {
                if (dm.is_open && dm.is_im)
                    dms.push(
                        <li key={idx} >
                            {dm.name}
                        </li>
                    );
            });
        return dms;
    },
    getGroups() {
        var groups = [];
        if (this.state.team && this.state.team.groups)
            _.forEach(this.state.team.groups, (group, idx) => {
                if (group.is_open && group.is_group && !group.is_archived)
                    groups.push(
                        <li key={idx} >
                            {group.name}
                        </li>
                    );
            });
        return groups;
    },
    render() {
        console.log(this.state.team)
        return (
            <aside className="sidebar">
                <h1>Channels</h1>
                
                <If test={this.state.team}>
                    <ul>
                        {this.getChannels()}
                    </ul>
                </If> 

                <h1>Direct Messages</h1>

                <If test={this.state.team}>
                    <ul>
                        {this.getDMS()}
                    </ul>
                </If> 
                <h1>Groups</h1>

                <If test={this.state.team}>
                    <ul>
                        {this.getGroups()}
                    </ul>
                </If> 
            </aside>
        );
    }
});