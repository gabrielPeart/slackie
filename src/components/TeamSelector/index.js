import React from 'react';
import _ from 'lodash';

import TeamSelectorActions from './actions';
import teamsEngineStore from '../../stores/teamsEngineStore';


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
                        return (
                            <div key={idx} >
                                {this.state.teams[team].api.team.name}
                            </div>
                            )
                    }, this)
                }
                <div onClick={TeamSelectorActions.add} className="add">
                    <i className="ion-plus-round"/>
                </div>
            </aside>
        );
    }
});