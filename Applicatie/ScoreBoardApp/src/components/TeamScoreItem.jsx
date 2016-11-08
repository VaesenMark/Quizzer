import React from 'react';
import * as ReactRedux from 'react-redux';



class TeamScoreItemUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <tr>
                <td>{this.props.teamName}</td>
                <td>{this.props.roundPoints}</td>
            </tr>
        );
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




export const TeamScoreItem =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TeamScoreItemUI);
