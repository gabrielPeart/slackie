import alt from '../../../../alt';
import SidebarActions from './actions';


class SidebarStore {
    constructor() {
        this.bindActions(SidebarActions);


        this.activeChannel = false;
    }

    onSetActive(channel) {
        this.setState({
            activeChannel: channel
        });
    }

}

export
default alt.createStore(SidebarStore);