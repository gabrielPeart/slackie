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
            expanded: !this.state.expanded
        });
    },

    handelLoaded() {
        this.props.Emmiter.emit('message:loaded', true);
    },

    render() {
        const fileSize = this.props.size ? <span className="inline-size">({prettyBytes(this.props.size)})</span> : null;
        const imageURL = this.props.image_url ? this.props.image_url : this.props.url_private;
        return (
            <span key={this.props.id}>
                {fileSize}
                <i onClick={this.handelInLineToggle} className={"toggle-inline " + (this.state.expanded ? 'ion-arrow-down-b' : 'ion-arrow-right-b')} />

                <ImageLoader
                    onLoad={this.handelLoaded}
                    className={"inline-image " + this.state.expanded}
                    src={imageURL} />
            </span>
        );
    }
});