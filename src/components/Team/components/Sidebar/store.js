import alt from '../../../../alt';
import SidebarActions from './actions';


class SidebarStore {
	constructor() {
		this.bindActions(SidebarActions);


		this.activeChannel = {};
	}

	onSetActive(channel) {
		this.activeChannel[channel.team] = channel.channel;
		this.setState({
			activeChannel: this.activeChannel
		});
	}

}

export
default alt.createStore(SidebarStore);