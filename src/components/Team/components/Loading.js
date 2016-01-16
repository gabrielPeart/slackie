import React from 'react';
import _ from 'lodash';

export
default React.createClass({
    getInitialState() {
        return {
            loading: 'Loading'
        };
    },

    animateDots() {
        if (!this.isMounted())
            return clearInterval(this.animateDotsAni);

        const maxDots = 7 + 2;
        const numDots = this.state.loading.length;

        this.setState({
            loading: (numDots <= maxDots) ? (this.state.loading + '.') : 'Loading'
        });
    },

    componentDidMount() {
        this.animateDotsAni = setInterval(this.animateDots, 300);
    },

    componentWillUnmount() {
        clearInterval(this.animateDotsAni);
    },

    render() {
        return (
            <div className={'slack-loading' + (this.props.team && this.props.channel ? ' chat' : '' )}>
                <p className="loading-text">{this.state.loading}</p>
                <img src="../images/slack_load.gif" />
        	</div>
        );
    }
});