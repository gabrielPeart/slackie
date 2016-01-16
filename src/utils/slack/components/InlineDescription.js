import React from 'react';
import ImageLoader from 'react-imageloader';

export
default React.createClass({
    render() {
        const service_name = this.props.service_name ? <p>{this.props.service_name}</p> : null;

        return (
            <span>
                {service_name}
                <a href={this.props.title_link}>{this.props.title}</a>
                {this.props.text}
            </span>
        );
    }
});