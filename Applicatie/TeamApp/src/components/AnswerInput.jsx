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
        this.props.submitAnswer()
    }

    render() {
        return (
            <div>
                Question {this.props.questionNumber}: {this.props.question}
                <input type="text" id="answer" value={this.props.answer} onChange={this.updateAnswer.bind(this)} />
                <br/>
                {this.props.receivedMessage}
                <br/>
                <button onClick={this.submitAnswer.bind(this)}>Submit</button>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        questionNumber: state.login.password,
        question: state.login.teamname,
        answer: state.login.loginMessage,
        receivedMessage: state.login.receivedMessage
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
