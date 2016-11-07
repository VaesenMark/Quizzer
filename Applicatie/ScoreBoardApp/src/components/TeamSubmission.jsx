import React from 'react';
import * as ReactRedux from 'react-redux';


class TeamSubmissionUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                -----
                <br/>
                Teamname: {this.props.teamName}
                <br/>
                Submitted answer: {this.props.submittedAnswer}
                <br/>
                Answer approved: {this.props.answerApproved == true ? 'YES' : ''}
                <br/>
                -----
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



export const TeamSubmission =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TeamSubmissionUI);
