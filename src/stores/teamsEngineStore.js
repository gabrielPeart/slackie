import alt from '../alt';
import _ from 'lodash';
import teamsEngineActions from '../actions/teamsEngineActions';
import TeamSelectorActions from '../components/TeamSelector/actions';


class TeamsEngineStore {
    constructor() {
        this.bindActions(teamsEngineActions);
        this.bindActions(TeamSelectorActions);

        this.noTeams = false;
        this.teams = {};
        this.selectedTeam = false;

    }

    onSelect(id) {
        this.setState({
            selectedTeam: id
        });
    }

    onNoTeams(){
        this.setState({
            noTeams: true
        });
    }

    onLoaded(slack) {
        this.teams[slack.slack.team.id] = slack;
        if(!this.selectedTeam)
            this.setState({
                noTeams: false,
                teams: this.teams,
                selectedTeam: slack.slack.team.id
            });
        else
            this.setState({
                noTeams: false,
                teams: this.teams
            });  
    }


    onAdded(slack) {
        this.teams[slack.slack.team.id] = slack;
        this.setState({
            noTeams: false,
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