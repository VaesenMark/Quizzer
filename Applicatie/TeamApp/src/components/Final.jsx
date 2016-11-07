import React from 'react';
import * as ReactRedux from 'react-redux';

class FinalUI extends React.Component {
    render() {
        return (
            <h1>This is the end of the game</h1>
        )
    }
}

function mapStateToProps(state) {
    return {
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}
export const Final =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FinalUI);
