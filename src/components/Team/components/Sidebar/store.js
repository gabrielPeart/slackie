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
		console.log("onSidebarToggle", this.sidebarCollapsed);
		this.sidebarCollapsed = this.sidebarCollapsed ? false : true;
		this.setState({
			sidebarCollapsed: this.sidebarCollapsed
		});
		console.log("New value", this.sidebarCollapsed);
	}
}

export
default alt.createStore(SidebarStore);