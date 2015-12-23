import alt from '../alt';
import _ from 'lodash';
import teamsEngineActions from '../actions/teamsEngineActions';



class TeamsEngineStore {
    constructor() {
        this.bindActions(teamsEngineActions);

        this.teams = {};
        this.selectedTeam = false;

    }


}

export
default alt.createStore(TeamsEngineStore);