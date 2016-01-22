import alt from '../../../../alt';
import SidebarActions from './actions';

class SidebarStore {
	constructor() {
		this.bindActions(SidebarActions);

		this.activeChannel = {};
		this.sidebarCollapsed = false;
	}

	onSetActive(channel) {
		this.activeChannel[channel.team] = channel.channel;
		this.setState({
			activeChannel: this.activeChannel
		});
	}

	onSidebarToggle() {
		this.setState({
			sidebarCollapsed: !this.sidebarCollapsed
		});
	}
}

export
default alt.createStore(SidebarStore);