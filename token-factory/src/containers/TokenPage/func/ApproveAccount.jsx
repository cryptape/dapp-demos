/**
 * Created by 包俊 on 2018/8/16.
 */
import React from "react";
import { Styles } from "./style";
import InputTo from "../../../components/Input/index";
import InputAmount from "../../../components/Input/index";
import { approveAccount } from "../../../contracts/tokenStore";
import Button from "../../../components/Button/index";

const toHint = "eg. 0x1ce21fa";
const amountHint = "eg. 10";

export default class ApproveAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      to: "",
      amount: "",
      button_status: true,
      button_text: "Approve Amount",
      result: ""
    };
  }

  render() {
    return (
      <div style={Styles.Content}>
        <text style={Styles.Title}>Approve Account</text>
        <text style={Styles.Tip}>
          Approve account to withdraw multiple times up to the specified amount.
        </text>
        <InputTo
          title={"to"}
          value={toHint}
          inputChanged={input => {
            this.setState({ to: input });
          }}
        />
        <InputAmount
          title={"amount"}
          value={amountHint}
          inputChanged={input => {
            this.setState({ amount: input });
          }}
        />
        <text style={Styles.ResultText}>{this.state.result}</text>
        <Button
          button_status={this.state.button_status}
          button_text={this.state.button_text}
          onClick={() => this._approve()}
        />
      </div>
    );
  }

  _approve() {
    if (this.state.to !== "" && this.state.amount !== "") {
      window.onSignError = (position, protocol) =>
        this._onSignError(position, protocol);
      this.setState({ button_status: false, button_text: "Submitting..." });
      approveAccount(
        this.props.contractAddress,
        this.state.to,
        this.state.amount
      )
        .then(result => {
          this.setState({
            result:
              this.state.amount +
              " has been approved to withdraw an amount of " +
              this.state.to,
            button_status: true,
            button_text: "Approve Amount"
          });
        })
        .catch(err => {
          alert(err);
          this.setState({
            button_status: true,
            button_text: "Approve Amount"
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
