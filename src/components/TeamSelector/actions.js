import Slack from 'slack-client';
import path from 'path';
import alt from '../../alt';
import OAuthUtil from '../../utils/OAuthUtil';
import Team from '../../utils/slack/teamUtil';
import commonUtil from '../../utils/commonUtil';
import {
    app
}
from 'remote';


const TeamsPath = path.join(app.getPath('userData'), 'teams.json');


class TeamselectorActions {
    constructor() {
        this.generateActions(
            'select',
            'added',
            'meta'
        );
    }

    add() {
        this.dispatch();
        OAuthUtil.getAuthorization()
            .then(token => {
                const SlackTeam = new Team(token.access_token);
                SlackTeam.on('logged-in', () => {
                    this.actions.added(SlackTeam);



                });
                SlackTeam.on('meta-refreshed', meta => {
                    this.actions.meta({
                        id: SlackTeam.slack.team.id,
                        meta: meta
                    });
                    commonUtil.readJson(TeamsPath)
                        .then((json = {}) => {
                            json[SlackTeam.slack.team.id] = {
                                meta: meta,
                                token: SlackTeam.slack.token
                            };
                            commonUtil.saveJson(TeamsPath, json)
                        }).catch(() => {
                            var json = {};
                            json[SlackTeam.slack.team.id] = {
                                meta: meta,
                                token: SlackTeam.slack.token
                            };
                            commonUtil.saveJson(TeamsPath, json)
                        });
                });
            })
            .catch(err => {
                console.error(err)
            });
    }

}

export
default alt.createActions(TeamselectorActions);