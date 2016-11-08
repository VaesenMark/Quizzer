import React from 'react';
import * as ReactRedux from 'react-redux';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'

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
        let errorType = "";
        if(this.props.submitSuccess === false) {
            errorType = "alert-warning"
        }
        if(this.props.submitSuccess === true) {
            errorType = "alert-success"
        }

        return (
            <div>
                <h2>Answer this question</h2>
                <br/>
                {this.props.question}
                <br/><br/><br/>
                <Form>
                    <FormGroup>
                        <ControlLabel>Your answer:</ControlLabel>
                        <FormControl
                            type="text"
                            className="maxInputWidth"
                            value={this.props.answer}
                            onChange={this.updateAnswer.bind(this)}
                        />
                    </FormGroup>
                </Form>
                <div className={`messageMaxWidth alert ${errorType}`}>
                    {this.props.message}
                </div>

                <br/>
                <button onClick={this.submitAnswer.bind(this)}>Submit</button>
                <br/><br/><br/>
                Question {this.props.questionNumber}/12
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        questionNumber: state.base.questionNumber,
        question: state.base.question,
        answer: state.answer.answer,
        message: state.answer.message,
        submitSuccess: state.answer.submitSuccess
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
