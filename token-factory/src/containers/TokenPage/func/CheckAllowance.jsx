/**
 * Created by 包俊 on 2018/8/16.
 */
import React from "react";
import { Styles } from "./style";
import InputOwner from "../../../components/Input/index";
import InputSpender from "../../../components/Input/index";
import Button from "../../../components/Button/index";
import { checkAllowance } from "../../../contracts/tokenStore";

const ownerHint = "eg. 0x1ce21fa";
const spenderHint = "eg. 0x1ce21fa";

export default class ApproveAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      owner: "",
      spender: "",
      button_status: true,
      button_text: "Check Allowance",
      result: ""
    };
  }

  render() {
    return (
      <div style={Styles.Content}>
        <text style={Styles.Title}>Check Allowance</text>
        <text style={Styles.Tip}>
          Check what amount has been approved for withdrawal between two
          accounts.
        </text>
        <InputOwner
          title={"owner"}
          value={ownerHint}
          inputChanged={input => {
            this.setState({ owner: input });
          }}
        />
        <InputSpender
          title={"spender"}
          value={spenderHint}
          inputChanged={input => {
            this.setState({ spender: input });
          }}
        />
        <text style={Styles.ResultText}>{this.state.result}</text>
        <Button
          button_status={this.state.button_status}
          button_text={this.state.button_text}
          onClick={() => this._checkAllowance()}
        />
      </div>
    );
  }
  _checkAllowance() {
    if (this.state.owner !== "" && this.state.spender !== "") {
      this.setState({ button_status: false, button_text: "Submitting..." });
      checkAllowance(
        this.props.contractAddress,
        this.state.owner,
        this.state.spender
      )
        .then(remaining => {
          this.setState({
            result:
              this.state.spender +
              " is allowed to spend " +
              remaining +
              " from " +
              this.state.owner,
            button_status: true,
            button_text: "Check Allowance"
          });
        })
        .catch(err => {
          alert(err);
          this.setState({
            button_status: true,
            button_text: "Check Allowance"
          });
        });
    }
  }
}
