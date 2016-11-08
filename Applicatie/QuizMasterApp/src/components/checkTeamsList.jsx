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
        let approvedTeams = 0;
        if (this.props.teams.length>0) {
            if(this.props.teams.length>=2){
                this.props.teams.forEach(function(team){
                    if(team.approved){
                        console.log(team);
                        approvedTeams = approvedTeams +1;
                        console.log(approvedTeams);
                    }
                });
                if(approvedTeams >1) {
                    startQuiz =<div id="startQuiz">
                        <button className="btn btn-primary" id="StartQuizButton" onClick={this.startQuiz.bind(this)}>
                            Start quiz
                        </button></div>
                }
            }
            theItems = this.props.teams.map((itm, idx) =>

                <CheckTeamsItem
                    item = {itm}
                    key = {itm._id}
                    name = {itm.teamName}
                    approved = {itm.approved}

                />
            )

        }

        return (<div>
                    <div id="CheckTeamHead">
                        <h1>quizID: {this.props.quiz._id}  Wachtwoord:  {this.props.quiz.password}</h1>
                    </div>
                    {this.props.message}<br/>
                {theItems}

                    {startQuiz}
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
