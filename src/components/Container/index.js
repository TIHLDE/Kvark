import Component from 'react';

export default class Container extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
