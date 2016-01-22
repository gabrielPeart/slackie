import alt from '../../../../alt';

class SidebarActions {
    constructor() {
        this.generateActions(
            'setActive',
            'sidebarToggle'
        );
    }

}

export
default alt.createActions(SidebarActions);
