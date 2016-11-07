import React from 'react';
import * as ReactRedux from 'react-redux';



class TeamScoreItemUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="TeamScores">
                TeamName: {this.props.teamName}
                <br/>
                RoundPoints: {this.props.roundPoints}
                <br/>
                <br/>
            </div>
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
