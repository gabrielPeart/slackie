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

    handelClick() {
        console.log("Click", this.state);
    },
    getImageWidths() {
        // This image size detection code may or may not have been sto...copied from Slacks own image
        //  size detection code. So, hypethetically, of couse... 
        //  Thankyou Slack for this code, pls don't sue me
        const max_w = 400;
        const max_h = 500;
        let newWidth, newHeight;
        let oldWidth = newWidth = parseInt(this.props.image_width);
        let oldHeight = newHeight = parseInt(this.props.image_height);
        if (newWidth > max_w) {
            newWidth = max_w;
            newHeight = parseInt(oldHeight * (newWidth / oldWidth))
        }
        if (newHeight > max_h) {
            newHeight = max_h;
            newWidth = parseInt(oldWidth * (newHeight / oldHeight))
        }

        return({
            width: newWidth + 'px',
            height: newHeight + 'px'
        });
    },

    render() {
        const fileSize = this.props.size ? <span className="inline-size">({prettyBytes(this.props.size)})</span> : null;
        const imageURL = this.props.image_url ? this.props.image_url : this.props.url_private;
        
        return (
            <span key={this.props.id} onClick={this.handelClick}>
                {fileSize}
                <i onClick={this.handelInLineToggle} className={"toggle-inline " + (this.state.expanded ? 'ion-arrow-down-b' : 'ion-arrow-right-b')} />

                <ImageLoader
                    onLoad={this.handelLoaded}
                    className={"inline-image " + this.state.expanded}
                    src={imageURL} style={this.getImageWidths()} wrapper={React.DOM.div} />
            </span>
        );
    }
});