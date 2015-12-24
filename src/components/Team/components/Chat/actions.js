import alt from '../../../../alt';

class ChatActions {
    constructor() {
        this.generateActions(
            'setActive',
            'newMessage'
        );
    }

}

export
default alt.createActions(ChatActions);
