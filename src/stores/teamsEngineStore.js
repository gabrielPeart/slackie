import alt from '../alt';
import _ from 'lodash';
import teamsEngineActions from '../actions/teamsEngineActions';
import TeamSelectorActions from '../components/TeamSelector/actions';


class TeamsEngineStore {
    constructor() {
        this.bindActions(teamsEngineActions);
        this.bindActions(TeamSelectorActions);
        this.teams = {};
        this.selectedTeam = false;

    }

    onAdded(team) {
        this.teams[team.token.team_id] = team;
        this.setState({
            teams: this.teams,
            selectedTeam: team.token.team_id
        });

    }


}

export
default alt.createStore(TeamsEngineStore);