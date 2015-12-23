import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';

import TeamSelectorActions from './actions';

export
default React.createClass({

    mixins: [PureRenderMixin],

    getInitialState() {
        return {
        };
    },

    componentWillMount() {
    },

    componentWillUnmount() {
    },

    update() {
        if (this.isMounted()) {
            this.setState({
            });
        }
    },

    render() {
        return (
            <aside className="teams">
                <div className="team">
                </div> 
                <div onClick={TeamSelectorActions.add} className="add">
                    <i className="ion-plus-round"/>
                </div>
            </aside>
        );
    }
});