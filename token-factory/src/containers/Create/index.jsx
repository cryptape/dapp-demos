/**
 * Created by 包俊 on 2018/8/14.
 */
import React from "react";
import TopNav from "../../components/TopNav/index";
import SupplyInput from "../../components/Input/index";
import NameInput from "../../components/Input/index";
import DecimalInput from "../../components/Input/index";
import SymbolInput from "../../components/Input/index";
import { deploy } from "../../contracts/tokenStore";
import Button from "../../components/Button/index";

let input_totally_supply = "eg. 10";
let input_name = "eg. Nervos";
let input_decimal_places = "eg. 4";
let input_symbol = "eg. NOS";

export default class Create extends React.Component {
  constructor() {
    super();
    this.state = {
      input_totally_supply: "",
      input_name: "",
      input_decimal_places: "",
      input_symbol: "",
      button_status: "true",
      button_text: "Create Token"
    };
  }

  render() {
    return (
      <div style={Styles.Content}>
        <TopNav />
        <text style={Styles.Title}>Create Token</text>
        <text style={Styles.Tip}>{this.state.result}</text>
        <text style={Styles.Tip}>
          Create Token Contract with the following parameters.
        </text>
        <SupplyInput
          title={"totally supply"}
          value={input_totally_supply}
          inputChanged={input => {
            this.setState({ input_totally_supply: input });
          }}
        />
        <NameInput
          title={"name"}
          value={input_name}
          inputChanged={input => {
            this.setState({ input_name: input });
          }}
        />
        <DecimalInput
          title={"decimal"}
          value={input_decimal_places}
          inputChanged={input => {
            this.setState({ input_decimal_places: input });
          }}
        />
        <SymbolInput
          title={"symbol"}
          value={input_symbol}
          inputChanged={input => {
            this.setState({ input_symbol: input });
          }}
        />
        <Button
          button_status={this.state.button_status}
          button_text={this.state.button_text}
          onClick={() => this._create()}
        />
      </div>
    );
  }

  _create() {
    if (
      this.state.input_totally_supply !== "" &&
      this.state.input_name !== "" &&
      this.state.input_decimal_places !== "" &&
      this.state.input_symbol !== ""
    ) {
      window.onSignError = (position, protocol) =>
        this._onSignError(position, protocol);
      this.setState({ button_text: "Submitting...", button_status: false });
      deploy([
        this.state.input_totally_supply,
        this.state.input_name,
        this.state.input_decimal_places,
        this.state.input_symbol
      ])
        .then(receipt => {
          console.log(receipt.contractAddress);
          if (receipt.contractAddress) {
            this.setState({ button_text: "Success!" });
            this.props.history.push("/token/" + receipt.contractAddress);
          } else {
            this._error(receipt.errorMessage);
          }
        })
        .catch(err => this._error(err));
    }
  }

  _error(msg) {
    this.setState({ button_text: "Create Token", button_status: true });
    alert(msg);
  }

  _onSignError(position, protocol) {
    alert(protocol);
    this.setState({
      button_status: true,
      button_text: "Create Token"
    });
  }
}

const Styles = {
  Content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  Logo: {
    width: 150,
    height: 150,
    marginTop: 40
  },
  Title: {
    fontSize: 24,
    marginTop: 20
  },
  Tip: {
    fontSize: 12,
    marginTop: 10
  },
  Button: {
    marginTop: 10,
    border: "none",
    color: "#000000",
    background: "#ffffff",
    borderRadius: 3
  },
  ButtonClickAble: {
    marginTop: 20,
    backgroundColor: "#2e6da4",
    padding: "6px 12px",
    color: "#fff",
    border: "1px solid #2e6da4",
    borderRadius: "4px",
    fontSize: "14px"
  },
  ButtonUnClickAble: {
    marginTop: 20,
    backgroundColor: "#d0d0d0",
    padding: "6px 12px",
    color: "#000",
    border: "1px solid #2e6da4",
    borderRadius: "4px",
    fontSize: "14px"
  }
};
