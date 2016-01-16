import React from 'react';
import prettyBytes from 'pretty-bytes';
import ImageLoader from 'react-imageloader';

export
default React.createClass({
    getInitialState() {
        return {
            expanded: true
        };
    },

    handelInLineToggle() {
        this.setState({
            attachmentExpanded: !this.state.attachmentExpanded
        });
    },

    render() {
        const fileSize = prettyBytes(this.props.size);
        return (
            <span key={this.props.id}>
                <span className="inline-size">({fileSize})</span>
                <i onClick={this.handelInLineToggle} className={"toggle-inline " + (this.state.expanded ? 'ion-arrow-down-b' : 'ion-arrow-right-b')} />

                <ImageLoader
                    className={"inline-image " + this.state.expanded}
                    src={this.props.url_private} />
            </span>
        );
    }
});