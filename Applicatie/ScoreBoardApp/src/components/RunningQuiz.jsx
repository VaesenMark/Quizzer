import React from 'react';
import * as ReactRedux from 'react-redux';

import {
    updateAnswerAction, submitAnswerAction
} from '../reducers';


class RunningQuizUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let theItems = [];
        if (this.props.teamSubmissions) {
            theItems = this.props.teamSubmissions.map((itm, idx) =>
                <TeamSubmission teamName={itm.teamName}
                                submittedAnswer={itm.submittedAnswer}
                                answerApproved={itm.answerApproved}
                                key={itm.teamName}/>
            );
        }
        return (
            <div>
                <div className="topbar">
                    Question {this.props.question}, Category: {this.props.category}
                </div>
                <div className="teamSubmissions">
                    {theItems}
                </div>
                <div className="bottomBar">
                    Quizz password: {this.props.quizPassword}, Round: {this.props.roundNumber}, Question: {this.props.questionNumber}/12
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
