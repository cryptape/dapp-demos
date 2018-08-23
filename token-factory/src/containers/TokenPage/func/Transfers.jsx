/**
 * Created by 包俊 on 2018/8/16.
 */
import React from "react";
import { Styles } from "./style";
import InputTo from "../../../components/Input/index";
import InputAmount from "../../../components/Input/index";
import Button from "../../../components/Button/index";
import { transfer } from "../../../contracts/tokenStore";

const toHint = "to:eg. 0x1ce21fa";
const amountHint = "amount: eg. 10";

export default class Transfers extends React.Component {
  constructor() {
    super();
    this.state = {
      to: "",
      amount: "",
      button_status: true,
      button_text: "Transfer Amount",
      result: ""
    };
  }

  render() {
    return (
      <div style={Styles.Content}>
        <text style={Styles.Title}>Transfer {this.props.name}</text>
        <text style={Styles.Tip}>Transfer to another account.</text>
        <InputTo
          value={toHint}
          inputChanged={input => {
            this.setState({ to: input });
          }}
        />
        <InputAmount
          value={amountHint}
          inputChanged={input => {
            this.setState({ amount: input });
          }}
        />
        <text style={Styles.ResultText}>{this.state.result}</text>
        <Button
          button_status={this.state.button_status}
          button_text={this.state.button_text}
          onClick={() => this._transfer()}
        />
      </div>
    );
  }

  _transfer() {
    if (this.state.to !== "" && this.state.amount !== "") {
      window.onSignError = (position, protocol) =>
        this._onSignError(position, protocol);
      this.setState({ button_status: false, button_text: "Submitting..." });
      transfer(this.props.contractAddress, this.state.to, this.state.amount)
        .then(result => {
          this.setState({
            result:
              this.state.amount + " has been transferred to " + this.state.to,
            button_status: true,
            button_text: "Transfer Amount"
          });
        })
        .catch(err => {
          alert(err);
          this.setState({
            button_status: true,
            button_text: "Transfer Amount"
          });
        });
    }
  }

  _onSignError(position, protocol) {
    alert(protocol);
    this.setState({
      button_status: true,
      button_text: "Transfer Amount"
    });
  }
}
