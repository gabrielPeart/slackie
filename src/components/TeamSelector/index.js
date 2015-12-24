import React from 'react';
import _ from 'lodash';

import TeamSelectorActions from './actions';
import teamsEngineStore from '../../stores/teamsEngineStore';


const Team = React.createClass({

    handelSelect(){
        TeamSelectorActions.select(this.props.team.id)
    },

    render() {

        var icon = this.props.meta ? 'url("' + this.props.meta.icon.image_original + '")' : false;

        return (
            <div onClick={this.handelSelect} className="team" style={{backgroundImage: icon}}>
                <p>{this.props.team.name}</p>
            </div>
        );
    }
});


export
default React.createClass({

    getInitialState() {
        return {
            active: false,
            teams: teamsEngineStore.getState().teams
        };
    },

    componentWillMount() {
        teamsEngineStore.listen(this.update);
    },

    update() {
        if (this.isMounted()) {
            this.setState({
                active: teamsEngineStore.getState().selectedTeam,
                teams: teamsEngineStore.getState().teams
            });
        }
    },

    render() {
        return (
            <aside className="teams">
                {
                    Object.keys(this.state.teams).map((team, idx) => {
                        return <Team key={idx} team={this.state.teams[team].slack.team} meta={this.state.teams[team].meta ? this.state.teams[team].meta : false} />;
                    }, this)
                }
                <div onClick={TeamSelectorActions.add} className="add">
                    <i className="ion-plus-round"/>
                </div>
            </aside>
        );
    }
});