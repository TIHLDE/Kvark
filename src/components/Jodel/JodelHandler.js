import React, {Component} from 'react'
import Jodel from './Jodel'

export default class JodelHandler extends Component{
    constructor(props){
        super(props);
        this.state = {jodelIds: []};
    };

    loadJodels() {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:8000/jodels/all/`, {
                    method: 'get'
                })
                .then(response => {
                    console.log('response: ' + response);
                    return response.json();
                }).then(data => {
                    console.log('loadJodels: ' + data);
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        });
    };

    componentDidMount() {
        this.loadJodels().then(data => {
            let jodelIds = [];
            for (let i = 0; i < data.len; i++) {
                jodelIds.append(data[i].id);
            }
            this.setState({jodelIds: jodelIds});
        })
    };

    render(){
        return(
            <div>
                {
                    this.state.jodelIds.map((id) => {
                        return <Jodel id={id}/>
                    })
                }
            </div>

        )
    };

}



