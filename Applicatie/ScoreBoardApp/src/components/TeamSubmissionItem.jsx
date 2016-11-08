import React from 'react';
import * as ReactRedux from 'react-redux';

import Table from 'react-bootstrap/lib/Table';

class TeamSubmissionItemUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.teamName}</td>
                <td>{this.props.submittedAnswer}</td>
                <td>{this.props.answerApproved == true ? 'YES' : ''}</td>
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



export const TeamSubmissionItem =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TeamSubmissionItemUI);
