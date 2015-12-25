import React from 'react';
import teamsEngineStore from '../../../../../stores/teamsEngineStore';


export
default React.createClass({

    getInitialState() {
        var TeamEngine = teamsEngineStore.getState();
        return {
            users: TeamEngine.selectedTeam ? TeamEngine.teams[TeamEngine.selectedTeam].slack.users : {},
        };
    },

    render() {
        var user = this.state.users[this.props.user];
        return (
            <div key={this.props.key} className="message">
                <img src={(user && user.profile.image_original) ? user.profile.image_original : ''} className="profile" />
                <h1>{(user && user.name) ? user.name : 'Undefined'}</h1>
                <span className="time">{this.props.time}</span>
            </div>
        );
    }
});