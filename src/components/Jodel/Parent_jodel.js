import React, {Component} from 'react'
import Jodel from './Jodel'

export default class Parent_jodel extends Component{
    constructor(props){
        super(props);
        this.state = {
            jodels:[
                {text:props.text || "no text", votes: props.votes || 0, time: props.time || "no time", voted: props.voted || false},
                {text:props.text || "no text", votes: props.votes || 0, time: props.time || "no time", voted: props.voted || false},
                {text:props.text || "no text", votes: props.votes || 0, time: props.time || "no time", voted: props.voted || false},
                {text:props.text || "no text", votes: props.votes || 0, time: props.time || "no time", voted: props.voted || false},
                {text:props.text || "no text", votes: props.votes || 0, time: props.time || "no time", voted: props.voted || false},
                {text:props.text || "no text", votes: props.votes || 0, time: props.time || "no time", voted: props.voted || false},
                {text:props.text || "no text", votes: props.votes || 0, time: props.time || "no time", voted: props.voted || false},
                {text:props.text || "no text", votes: props.votes || 0, time: props.time || "no time", voted: props.voted || false},
            ]
        };
    };

    render(){
        return(
            <div>
                {
                    this.state.jodels.map((jodel) => {
                        return <Jodel text={jodel.text} votes={jodel.votes} time={jodel.time} voted={jodel.voted}/>
                    })
                }
            </div>

        )
    };

}



