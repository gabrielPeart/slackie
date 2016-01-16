import React from 'react';
import _ from 'lodash';

export
default React.createClass({
    getInitialState() {
        return {
            dots: ''
        };
    },

    animateDots() {
        if (!this.isMounted())
            return clearInterval(this.animateDotsAni);

        const maxDots = 3;

        this.setState({
            dots: (this.state.dots.length < maxDots) ? (this.state.dots + '.') : ''
        });
    },

    componentDidMount() {
        this.animateDotsAni = setInterval(this.animateDots, 400);
    },

    componentWillUnmount() {
        clearInterval(this.animateDotsAni);
    },

    render() {
        return (
            <div className={'slack-loading' + (this.props.team && this.props.channel ? ' chat' : '' )}>
                <p className="loading-text">Loading<span>{this.state.dots}</span></p>
                <img src="../images/slack_load.gif" />
        	</div>
        );
    }
});