/**
 * Created by 包俊 on 2018/8/15.
 */
import React from "react";

export default class Input extends React.Component {
  constructor() {
    super();
    this.state = {
      input: ""
    };
  }

  componentDidMount() {
    if (this.props.def !== undefined) this.setState({ input: this.props.def });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.def !== undefined) this.setState({ input: nextProps.def });
  }

  render() {
    return (
      <div>
        <input
          style={Styles.Input}
          value={this.state.input}
          placeholder={this.props.value}
          onChange={e => this._inputChanged(e)}
        />
      </div>
    );
  }

  //get input
  _inputChanged(e) {
    this.setState({ input: e.target.value });
    this.props.inputChanged(e.target.value);
  }
}

const Styles = {
  Input: {
    marginTop: 15,
    width: "100%",
    color: "#000000",
    fontSize: 16,
    padding: "4px 8px"
  }
};
