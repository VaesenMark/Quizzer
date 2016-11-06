import React from 'react';
import * as ReactRedux from 'react-redux';

import {
    updateAnswerAction, submitAnswerAction
} from '../reducers';


class QuestionInputUI extends React.Component {
    constructor(props) {
        super(props)
    }

    updateAnswer(evt) {
        this.props.updateAnswer(evt.target.value)
    }

    submitAnswer() {
        this.props.submitAnswer(this.props.answer)
    }

    render() {
        return (
            <div>
                <h2>Answer this question</h2>
                <br/>
                Question {this.props.questionNumber}/12
                <br/>
                {this.props.question}
                <br/>
                <br/>
                Your answer:
                <br/>
                <input type="text" id="answer" value={this.props.answer} onChange={this.updateAnswer.bind(this)} />
                <br/>
                {this.props.message}
                <br/>
                <button onClick={this.submitAnswer.bind(this)}>Submit</button>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        questionNumber: state.base.questionNumber,
        question: state.base.question,
        answer: state.answer.answer,
        message: state.answer.message
    }
}


function mapDispatchToProps(dispatch) {
    return {
        updateAnswer: (answer) => dispatch(updateAnswerAction(answer)),
        submitAnswer: (answer) => dispatch(submitAnswerAction(answer))
    }
}




export const QuestionInput =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionInputUI);
