import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Dialog } from 'material-ui';

import ModalStore from './store';
import ModalActions from './actions';
import AddProvider from './components/AddProvider';

export
default React.createClass({

    mixins: [PureRenderMixin],
    
    getInitialState() {
        return {
            isOpen: ModalStore.getState().open,
            type: ModalStore.getState().type
        };
    },

    componentDidMount() {
        ModalStore.listen(this.update);
    },

    componentWillUnmount() {
        ModalStore.unlisten(this.update);
    },

    update() {
        if (this.isMounted()) {
            this.setState({
                isOpen: ModalStore.getState().open,
                type: ModalStore.getState().type
            });
        }
    },

    getStyle() {
        switch (this.state.type) {
            case 'URLAdd':
                return {
                    height: '200px'
                };
        }
    },

    getContents() {
        switch (this.state.type) {
            case 'AddProvider':
                return <AddProvider />;
                break;
        }
    },

    render() {
        return (
            <Dialog
                style={this.getStyle()}
                open={this.state.isOpen}
                autoScrollBodyContent={true}
                onRequestClose={this.closeModal}>
                {this.getContents()}
            </Dialog>
        );
    }
});