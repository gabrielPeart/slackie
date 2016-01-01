import Promise from 'bluebird';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import async from 'async';
import {
    app
}
from 'remote';

import commonUtil from './commonUtil';
import SlackTeam from './slack/teamUtil';
import TeamSelectorActions from '../components/TeamSelector/actions';

const TeamsPath = path.join(app.getPath('userData'), 'teams.json');



const TeamSaveQueue = async.queue((params, next) => {
    var [id, type, token, meta] = JSON.parse(params);

    commonUtil.readJson(TeamsPath)
        .then(json => {
            json[id] = {
                meta: meta,
                type: type,
                token: token
            };
            commonUtil.saveJson(TeamsPath, json)
                .then(() => process.nextTick(next))
                .catch(err => {
                    console.error(err);
                    process.nextTick(next);
                });
        })
        .catch(() => {
            commonUtil.saveJson(TeamsPath, {
                [id]: {
                    meta: meta,
                    type: type,
                    token: token
                }
            })
                .then(() => process.nextTick(next))
                .catch(err => {
                    console.error(err);
                    process.nextTick(next);
                });
        });

});



const parseTeams = teams => {
    _.forEach(teams, team => {
        switch (team.type) {
            case 'slack':
                let Team = new SlackTeam(team.token, team.meta);
                Team.once('logged-in', () => TeamSelectorActions.loaded(Team));

                Team.on('meta-refreshed', meta => {
                    TeamSelectorActions.meta({
                        id: Team.slack.team.id,
                        meta: meta
                    });
                    TeamSaveQueue.push(JSON.stringify([Team.slack.team.id, 'slack', team.token, meta]));
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