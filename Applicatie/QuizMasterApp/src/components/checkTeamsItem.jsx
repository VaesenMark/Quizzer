import React from 'react'
import * as ReactRedux from 'react-redux';

class CheckTeamItemsUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return  (

            <h1>test</h1>

        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        //   approveTeam: (quizID,teamID) => dispatch(approveTeam(teamID, approve))
    }
}

function mapStateToProps(state) {
    return {
        quiz: state.headState.quizItem
    }
}

export const checkTeamsItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckTeamItemsUI);
