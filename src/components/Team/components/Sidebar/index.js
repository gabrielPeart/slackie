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
                channels.push(
                    <li key={idx} >
                        #{channel.name}
                    </li>
                );
            });
        return channels;
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
                
            </aside>
        );
    }
});