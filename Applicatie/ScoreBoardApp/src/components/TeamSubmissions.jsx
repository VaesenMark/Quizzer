import React from 'react';
import * as ReactRedux from 'react-redux';
import {TeamSubmissionItem} from './TeamSubmissionItem'

import Table from 'react-bootstrap/lib/Table';

class TeamSubmissionsUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let theItems = [];
        if (this.props.teamSubmissions) {
            theItems = this.props.teamSubmissions.map((itm, idx) =>
                <TeamSubmissionItem teamName={itm.teamName}
                                submittedAnswer={itm.answer}
                                answerApproved={itm.approved}
                                key={itm.teamName}/>
            );
        }
        return (
            <div>
                {this.props.teamSubmissions ? <strong>Team answers</strong> : ''}
                {this.props.teamSubmissions ?
                    <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>Submitted</th>
                            <th>Approved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {theItems}
                    </tbody>
                </Table> : <span><br/><br/>The teams are answering the question</span>}
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        teamSubmissions: state.base.teamSubmissions
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}



export const TeamSubmissions =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TeamSubmissionsUI);
