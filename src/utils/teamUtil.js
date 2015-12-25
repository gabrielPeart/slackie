import Promise from 'bluebird';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import {
    app
}
from 'remote';

import commonUtil from './commonUtil';
import SlackTeam from './slack/teamUtil';
import TeamSelectorActions from '../components/TeamSelector/actions';

const TeamsPath = path.join(app.getPath('userData'), 'teams.json');



const parseTeams = teams => {
    _.forEach(teams, team => {
        switch (team.type) {
            case 'slack':
                let Team = new SlackTeam(team.token, team.meta);
                Team.once('logged-in', () => TeamSelectorActions.added(Team));

                Team.on('meta-refreshed', meta => {
                    TeamSelectorActions.meta({
                        id: Team.slack.team.id,
                        meta: meta
                    });
                    commonUtil.readJson(TeamsPath)
                        .then(json => {
                            json[Team.slack.team.id] = {
                                meta: meta,
                                token: Team.slack.token
                            };
                            commonUtil.saveJson(TeamsPath, json);
                        })
                        .catch(() => {
                            commonUtil.saveJson(TeamsPath, {
                                [Team.slack.team.id]: {
                                    meta: meta,
                                    token: Team.slack.token
                                }
                            });
                        });
                });
                break;
        }
    });
}



module.exports = {
    reload() {
        commonUtil.readJson(TeamsPath)
            .then(parseTeams)
            .catch(() => {
                console.info('No teams logged in');
            });
    }
}