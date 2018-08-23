/**
 * Created by 包俊 on 2018/8/16.
 */
import React from "react";
import { Styles } from "./style";
import InputTo from "../../../components/Input/index";
import Button from "../../../components/Button/index";
import { balanceOf } from "../../../contracts/tokenStore";

const toHint = "eg. 0x1ce21fa";

export default class ApproveAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      to: "",
      button_status: true,
      button_text: "Check Balance",
      balance: ""
    };
  }

  render() {
    return (
      <div style={Styles.Content}>
        <text style={Styles.Title}>Check Balance</text>
        <text style={Styles.Tip}>Check balance of account.</text>
        <InputTo
          title={"to"}
          def={this.state.to}
          value={toHint}
          inputChanged={input => {
            this.setState({ to: input });
          }}
        />
        <text style={Styles.ResultText}>{this.state.balance}</text>
        <Button
          button_status={this.state.button_status}
          button_text={this.state.button_text}
          onClick={() => this._checkBalaceOf()}
        />
      </div>
    );
  }

  _checkBalaceOf() {
    if (this.state.to !== "") {
      this.setState({ button_status: false, button_text: "Checking..." });
      balanceOf(this.props.contractAddress, this.state.to)
        .then(balance => {
          this.setState({
            balance: "Balance of " + this.state.to + " is " + balance,
            button_status: true,
            button_text: "Check Balance"
          });
        })
        .catch(err => {
          this.setState({
            button_status: true,
            button_text: "Check Balance"
          });
        });
    }
  }
}
