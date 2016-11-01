import React from 'react'

export default class IFrameArea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <iframe className="IFrameView"
                    src={this.props.item.url}
                    sandbox="allow-forms allow-scripts allow-same-origin"
                    scrolling="no"
            />

        );
    }
}
