import React from 'react'
import * as ReactRedux from 'react-redux';
import {startQuiz} from '../reducers';
import {CheckTeamsItem} from './checkTeamsItem'

class CheckTeamsListUI extends React.Component {
    startQuiz(){
        this.props.startQuiz(this.props.quiz);
    }

    render() {
        let theItems = [];
        let startQuiz = '';
        console.log("items", this.props.teams.length);

        if (this.props.teams.length>0) {
            if(this.props.teams.length>=2){
                startQuiz = <button id="button" onClick={this.startQuiz.bind(this)}>
                    Start quiz
                </button>
            }
            this.props.teams.forEach(function(team){
                console.log(team);
                console.log(team.approved);
            });
            theItems = this.props.teams.map((itm, idx) =>

                <CheckTeamsItem
                    item = {itm}
                    key = {itm._id}
                    name = {itm.teamName}
                    approved = {itm.approved}

                />
            )

        }

        console.log("items12", theItems, this.props.teams.length);

        return (<div>


                <h1>quizID: {this.props.quiz._id}  Wachtwoord:  {this.props.quiz.password}</h1>
                {this.props.message}<br/>
                {startQuiz}
                {theItems}
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        startQuiz: (quiz) => dispatch(startQuiz(quiz)),
    }
}

function mapStateToProps(state) {
    return {
        quiz: state.MainState.quizItem,
        teams : state.TeamState.teams,
        message: state.TeamState.message
    }
}

export const CheckTeamList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckTeamsListUI);
