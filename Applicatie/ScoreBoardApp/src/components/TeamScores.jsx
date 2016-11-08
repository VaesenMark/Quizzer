import React from 'react';
import * as ReactRedux from 'react-redux';
import {TeamScoreItem} from './TeamScoreItem';

import Table from 'react-bootstrap/lib/Table';

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
                {this.props.teamScores ?
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Round Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {theItems}
                        </tbody>
                    </Table> : ''}
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
