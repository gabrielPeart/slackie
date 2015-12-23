import alt from '../../alt';

import OAuthUtil from '../../utils/OAuthUtil';

class TeamselectorActions {
    constructor() {
        this.generateActions(
        );
    }

    add(){
        this.dispatch();

        OAuthUtil.getAuthorization();

    }


}

export
default alt.createActions(TeamselectorActions);
