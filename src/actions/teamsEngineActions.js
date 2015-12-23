import Promise from 'bluebird';
import async from 'async';
import _ from 'lodash';
import alt from '../alt';
import {
    EventEmitter
}
from 'events';



class teamsEngineActions {

    constructor() {
        this.generateActions(
            'added',
            'removed',
            'reconnected'
        );
    }

}

export
default alt.createActions(teamsEngineActions);