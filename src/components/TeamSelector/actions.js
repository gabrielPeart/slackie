import Slack from 'slack-client';

import alt from '../../alt';


import OAuthUtil from '../../utils/OAuthUtil';

class TeamselectorActions {
	constructor() {
		this.generateActions(
			'added',
			'loggedin'
		);
	}

	add() {
		this.dispatch();

		OAuthUtil.getAuthorization()
			.then(token => {
				var slackObj = {
					api: new Slack(token.access_token, true, false),
					token: token
				};
				this.actions.added(slackObj);
			})
			.catch(() => {

			});
	}


}

export
default alt.createActions(TeamselectorActions);