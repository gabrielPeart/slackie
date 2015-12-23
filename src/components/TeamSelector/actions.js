import alt from '../../alt';

import OAuthUtil from '../../utils/OAuthUtil';

class TeamselectorActions {
	constructor() {
		this.generateActions(
			'added'
		);
	}

	add() {
		this.dispatch();

		OAuthUtil.getAuthorization()
			.then(token => this.actions.added(token));

	}


}

export
default alt.createActions(TeamselectorActions);