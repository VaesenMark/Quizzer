import React from 'react';
import * as ReactRedux from 'react-redux';

import {
    updateAnswerAction, submitAnswerAction
} from '../reducers';


class AnswerJudgementUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                Question closed. Wait for the quizmaster to evaluate your asnwer.
                <br/>
                {this.props.questionNumber}: {this.props.question}
                <br/>
                Your answer: {this.props.answer}
                <br/>
                Answer accepted: {this.props.answer}
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        questionNumber: state.base.questionNumber,
        question: state.base.question,
        answer: state.answer.answer,
        message: state.answer.accepted
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}




export const AnswerJudgement =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AnswerJudgementUI);