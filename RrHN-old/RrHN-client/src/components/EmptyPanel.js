import React from 'react'

export default class EmptyPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                No selection made yet
            </div>
        );
    }
}