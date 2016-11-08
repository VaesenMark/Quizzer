import React from 'react';
import * as ReactRedux from 'react-redux';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';


class AnswerJudgementUI extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h2>Question closed</h2>
                <br/>
                Wait for the quizmaster to evaluate your answer.
                <br/><br/><br/>
                <Row>
                    <Col xs={12} sm={2}>
                        <strong>The question:</strong>
                    </Col>
                    <Col xs={12} sm={10}>
                        {this.props.question}
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col xs={12} sm={2}>
                        <strong>Your answer:</strong>
                    </Col>
                    <Col xs={12} sm={10}>
                        {this.props.answer}
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col xs={12} sm={2}>
                        <strong>Answer accepted:</strong>
                    </Col>
                    <Col xs={12} sm={10}>
                        <span className="answerJudgedText">{this.props.accepted == true ? 'YES' : ''}</span>
                    </Col>
                </Row>
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
        accepted: state.answer.accepted
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}




export const AnswerJudgement =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AnswerJudgementUI);
