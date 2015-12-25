import alt from '../../alt';
import modalActions from './actions';


class modalStore {
    constructor() {
        this.bindActions(modalActions);

        this.open = false;
        this.type = false;
        this.thinking = false;
    }

    onOpen(data) {
        this.setState({
            open: true,
            type: data.type
        });
    }

    onThinking() {
        this.setState({
            type: 'thinking'
        });
    }

    onClose() {
        this.setState({
            open: false,
            thinking: false,
            type: false
        });
    }
}

export
default alt.createStore(modalStore);