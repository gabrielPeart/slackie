import React from 'react';
import _ from 'lodash';


import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Loading from './components/Loading';
import NoTeams from './components/NoTeams';
import teamsEngineStore from '../../stores/teamsEngineStore';
import SidebarStore from './components/Sidebar/store';
import SidebarActions from './components/Sidebar/actions';


const If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});

export
default React.createClass({

    getInitialState() {
        var TeamEngine = teamsEngineStore.getState();
        var SidebarState = SidebarStore.getState();
        return {
            noTeams: TeamEngine.noTeams,
            loading: (TeamEngine.selectedTeam && SidebarState.activeChannel) ? false : true,
            team: TeamEngine.selectedTeam ? TeamEngine.teams[TeamEngine.selectedTeam] : false,
            channel: (SidebarState.activeChannel && SidebarState.activeChannel[TeamEngine.selectedTeam]) ? SidebarState.activeChannel[TeamEngine.selectedTeam] : false,
            messages: (TeamEngine.selectedTeam && SidebarState.activeChannel) ? TeamEngine.teams[TeamEngine.selectedTeam].messages[SidebarState.activeChannel] : [],
            selectedTeam: 'unLoaded'
        };
    },

    componentWillMount() {
        teamsEngineStore.listen(this.updateTeam);
        SidebarStore.listen(this.updateChannel);
    },
    componentWillUnmount() {
        teamsEngineStore.unlisten(this.updateTeam);
        SidebarStore.unlisten(this.updateChannel);
    },

    getMessages() {
        if (!this.state.team || !this.state.channel)
            return false;

        this.setState({
            loading: true,
            messages: []
        });
        this.state.team.removeAllListeners('new:message');
        this.state.team.removeAllListeners('history:loaded');
        this.state.team.on('new:message', this.updateMessages);
        this.state.team.on('history:loaded', this.updateMessages);
        _.defer(() => this.state.team.fetchHistory(this.state.channel.id));
    },

    updateMessages() {
        if (this.isMounted()) {
            this.setState({       
                loading: false,         
                messages: this.state.team.messages[this.state.channel.id]
            });
        }
    },
    updateChannel() {
        if (this.isMounted()) {
            var TeamEngine = teamsEngineStore.getState();
            var SidebarState = SidebarStore.getState();

            this.setState({
                channel: (SidebarState.activeChannel && SidebarState.activeChannel[TeamEngine.selectedTeam]) ? SidebarState.activeChannel[TeamEngine.selectedTeam] : false,
                messages: []
            });
            _.defer(this.getMessages);
        }
    },
    updateTeam() {
        if (this.isMounted()) {
            var TeamEngine = teamsEngineStore.getState();

            if(this.state.selectedTeam === TeamEngine.selectedTeam)
                return;

            this.setState({
                noTeams: TeamEngine.noTeams,
                team: TeamEngine.selectedTeam ? TeamEngine.teams[TeamEngine.selectedTeam] : false,
                selectedTeam: TeamEngine.selectedTeam
            });
            this.updateChannel();
            _.defer(this.handelTeamUpdate);           
        }
    },

    handelTeamUpdate(){
        if(!this.state.team)
            return;

        if(!this.state.channel){
            var general = _(this.state.team.slack.channels)
                .filter(channel => { return channel.is_general; })
                .value()[0];

            _.defer(()=> SidebarActions.setActive({
                team: this.state.team.slack.team.id, 
                channel: general
            }));            
        }
    },

    render() {
        if(this.state.noTeams)
            return <NoTeams />;

        const Contents = this.state.loading ? <Loading team={this.state.team} channel={this.state.channel} /> : <Chat 
            emitter={this.state.team} 
            team={this.state.team.slack} 
            channel={this.state.channel} 
            name={ (this.state.channel && this.state.channel.is_channel) ? ('#' + this.state.channel.name) : this.state.channel.name} 
            topic={this.state.channel.topic ? this.state.channel.topic.value.split('\n') : undefined} 
            messages={this.state.messages ? this.state.messages : []} />

        return (
            <div>
                <If test={this.state.team}>
                    <Sidebar channel={this.state.channel.id} team={this.state.team}/>
                </If>
                {Contents}
            </div>
        );
    }
});