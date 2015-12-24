import alt from '../../../../alt';
import ChatActions from './actions';


class ChatStore {
    constructor() {
        this.bindActions(ChatActions);

        this.messages = {};

    }

    onNewMessages(messages){


        
    }

    onNewMessage(msg) {
        var team = this.messages[msg.team.id];
        if (!team) this.messages[msg.team.id] = {};

        var channel = this.messages[msg.team.id][msg.channel.id];
        if (!channel) this.messages[msg.team.id][msg.channel.id] = [];

        this.messages[msg.team.id][msg.channel.id].push(msg);
        this.setState({
            messages: this.messages
        });
    }

}

export
default alt.createStore(ChatStore);