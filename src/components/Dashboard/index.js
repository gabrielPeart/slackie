import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';


import TeamsStore from '../../stores/teamsEngineStore';
import TeamsActions from '../../actions/teamsEngineActions';

export
default React.createClass({

    mixins: [PureRenderMixin],

    getInitialState() {
        return {
        };
    },

    componentWillMount() {
        TeamsStore.listen(this.update);
    },

    componentWillUnmount() {
        TeamsStore.unlisten(this.update);
    },

    update() {
        if (this.isMounted()) {
            this.setState({
            });
        }
    },
    render() {
        return (
            <div className="main">

            </div>
        );
    }
});