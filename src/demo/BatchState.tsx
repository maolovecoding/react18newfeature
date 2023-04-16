import { Component } from 'react';
export default class extends Component {
  state = {
    number: 0
  };
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+1</button>
      </div>
    );
  }
  handleClick = () => {
    this.setState({
      number: this.state.number + 1
    });
    console.log(this.state.number);
    this.setState({
      number: this.state.number + 1
    });
    console.log(this.state.number);
    setTimeout(() => {
      this.setState({
        number: this.state.number + 1
      });
      console.log(this.state.number);
      this.setState({
        number: this.state.number + 1
      });
      console.log(this.state.number);
    }, 0);
    // 老模式 输出的是 0 0 2 3
    // 18模式 输出的是 0 0 1 1
  };
}