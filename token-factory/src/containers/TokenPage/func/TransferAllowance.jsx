/**
 * Created by 包俊 on 2018/8/16.
 */
import React from "react";
import { Styles } from "./style";
import InputFrom from "../../../components/Input/index";
import InputTo from "../../../components/Input/index";
import InputAmount from "../../../components/Input/index";
import Button from "../../../components/Button/index";
import { transferAllowance } from "../../../contracts/tokenStore";

const fromHint = "eg. 0x1287fasjs";
const toHint = "eg. 0x1ce21fa";
const amountHint = "eg. 10";

export default class ApproveAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      from: "",
      to: "",
      amount: "",
      button_status: true,
      button_text: "Transfer Allowance",
      result: ""
    };
  }

  render() {
    return (
      <div style={Styles.Content}>
        <text style={Styles.Title}>Transfer Allowance</text>
        <text style={Styles.Tip}>
          Transfer between accounts a specified amount that you've been
          authorised to do so.
        </text>
        <InputFrom
          title={"from"}
          value={fromHint}
          inputChanged={input => {
            this.setState({ from: input });
          }}
        />
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
          onClick={() => this._transferFrom()}
        />
      </div>
    );
  }

  _transferFrom() {
    if (
      this.state.to !== "" &&
      this.state.from !== "" &&
      this.state.amount !== ""
    ) {
      window.onSignError = (position, protocol) =>
        this._onSignError(position, protocol);
      window.onSignSuccessful = (position, protocol) =>
        this._onSignSuccessful(position, protocol);
      this.setState({ button_status: false, button_text: "Submitting..." });
      transferAllowance(
        this.props.contractAddress,
        this.state.from,
        this.state.to,
        this.state.amount
      );
    }
  }

  _onSignError(position, protocol) {
    alert(protocol);
    this.setState({
      button_status: true,
      button_text: "Transfer Amount"
    });
  }

  _onSignSuccessful(position, protocol) {
    // alert(protocol);
    this.setState({
      button_text: "pending..."
    });
    window.onSignSuccessful = null;
    window.nervos.listeners
      .listenToTransactionReceipt(protocol)
      .then(receipt => {
        console.log(receipt);
        if (!receipt.errorMessage) {
          this.setState({
            result:
              this.state.amount +
              " has been transferred to " +
              this.state.to +
              " from " +
              this.state.from,
            button_status: true,
            button_text: "Transfer Allowance"
          });
        } else {
          alert(receipt.errorMessage);
          this.setState({
            button_status: true,
            button_text: "Transfer Allowance"
          });
        }
      })
      .catch(err => {
        alert(JSON.stringify(err));
        this.setState({
          button_status: true,
          button_text: "Transfer Allowance"
        });
      });
  }
}
