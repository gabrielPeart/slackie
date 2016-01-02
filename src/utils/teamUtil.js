import Promise from 'bluebird';
import _ from 'lodash';
import ls from 'local-storage';
import async from 'async';

import SlackTeam from './slack/teamUtil';
import TeamSelectorActions from '../components/TeamSelector/actions';


const TeamSaveQueue = async.queue((params, next) => {
	const [id, type, token, meta] = params;

	var teams = ls.get('teams') || {};

	teams[id] = {
		meta,
		type,
		token
	};

	ls.set('teams', teams);
	next();
});


const LoadTeams = async.queue((team, next) => {
	switch (team.type) {
		case 'slack':
			const Team = new SlackTeam(team.token, team.meta);
			Team.once('logged-in', () => {
				TeamSelectorActions.loaded(Team);
				next();
			});

			Team.on('meta-refreshed', meta => {
				TeamSelectorActions.meta({
					id: Team.slack.team.id,
					meta: meta
				});
				TeamSaveQueue.push(JSON.stringify([Team.slack.team.id, 'slack', team.token, meta]));
			});
			break;
	}
}, 2);

module.exports = {
	reload() {
		_.forEach((ls.get('teams') || {}), team => LoadTeams.push(team));
	}
}