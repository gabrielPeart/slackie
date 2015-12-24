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

    onSelect(id) {
        this.setState({
            selectedTeam: id
        });
    }

    onAdded(slack) {
        this.teams[slack.slack.team.id] = slack;
        this.setState({
            teams: this.teams,
            selectedTeam: slack.slack.team.id
        });
    }

    onMeta(meta) {
        this.teams[meta.id].meta = meta.meta;
        this.setState({
            teams: this.teams
        });
    }

}

export
default alt.createStore(TeamsEngineStore);