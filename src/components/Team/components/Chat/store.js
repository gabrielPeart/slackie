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
        this.setState({
            messages: this.messages
        });
    }

}

export
default alt.createStore(ChatStore);