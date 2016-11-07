import React from 'react';
import * as ReactRedux from 'react-redux';
import {TeamSubmission} from './TeamSubmission'
import {TeamScores} from './TeamScores'



class RunningQuizUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let theItems = [];
        if (this.props.teamSubmissions) {
            theItems = this.props.teamSubmissions.map((itm, idx) =>
                <TeamSubmission teamName={itm.teamName}
                                submittedAnswer={itm.answer}
                                answerApproved={itm.approved}
                                key={itm.teamName}/>
            );
        }
        return (
            <div>
                <div className="topbar">
                    <h3>Question: {this.props.question}</h3>
                    <h3>Category: {this.props.category}</h3>
                    <h3>Round: {this.props.roundNumber}</h3>
                    <h3>Question: {this.props.questionNumber}/12</h3>
                </div>
                <hr/>
                <div className="teamSubmissions">
                    <strong>Team answers:</strong>
                    {theItems}
                </div>
                <hr/>
                <div className="Team scores">
                    <TeamScores/>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        question: state.base.question,
        questionNumber: state.base.questionNumber,
        category: state.base.category,
        quizPassword: state.base.quizPassword,
        roundNumber: state.base.roundNumber,
        teamSubmissions: state.base.teamSubmissions
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}




export const RunningQuiz =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RunningQuizUI);
