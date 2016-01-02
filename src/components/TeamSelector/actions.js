import Slack from 'slack-client';
import alt from '../../alt';
import OAuthUtil from '../../utils/OAuthUtil';
import Team from '../../utils/slack/teamUtil';
import ls from 'local-storage';


class TeamselectorActions {
    constructor() {
        this.generateActions(
            'select',
            'added',
            'loaded',
            'meta'
        );
    }

    add() {
        this.dispatch();
        OAuthUtil.getAuthorization()
            .then(token => {
                const SlackTeam = new Team(token.access_token);
                SlackTeam.on('logged-in', () => this.actions.added(SlackTeam));
                SlackTeam.on('meta-refreshed', meta => {
                    this.actions.meta({
                        id: SlackTeam.slack.team.id,
                        meta
                    });

                    var teams = ls.get('teams') || {};

                    teams[SlackTeam.slack.team.id] = {
                        type: 'slack',
                        token: SlackTeam.slack.token,
                        meta
                    };

                    ls.set('teams', teams);
                });
            })
            .catch(err => console.error(err));
    }
}

export
default alt.createActions(TeamselectorActions);