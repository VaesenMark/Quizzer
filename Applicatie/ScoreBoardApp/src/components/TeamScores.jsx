import React from 'react';
import * as ReactRedux from 'react-redux';
import {TeamScoreItem} from './TeamScoreItem';


class TeamScoresUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let theItems = [];
        if (this.props.teamScores) {
            console.log(this.props.teamScores);
            theItems = this.props.teamScores.map((itm, idx) =>
                <TeamScoreItem teamName={itm.teamName}
                                   roundPoints={itm.roundPoints}
                                   key={itm.teamName}/>);
        }
        return (
            <div>
                {this.props.teamScores ? <strong>Team scores</strong> : ''}
                {theItems}
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        teamScores: state.base.teamScores
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}



export const TeamScores =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TeamScoresUI);
