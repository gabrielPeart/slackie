import alt from '../../alt';
import ChatActions from './actions';


class ChatStores {
    constructor() {
        this.bindActions(ChatActions);

        this.messages = {};

    }

    onCacheMessage(message){



    }

}

export
default alt.createStore(ChatStores);