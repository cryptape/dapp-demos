/**
 * Created by 包俊 on 2018/8/16.
 */
import React from "react";

import TopNav from "../../components/TopNav/index";
import { getAttrs } from "../../contracts/tokenStore";
import Transfers from "./func/Transfers";
import ApproveAccount from "./func/ApproveAccount";
import CheckBalance from "./func/CheckBalance";
import TransferAllowance from "./func/TransferAllowance";
import CheckAllowance from "./func/CheckAllowance";

export default class TokenPage extends React.Component {
  constructor() {
    super();
    this.state = {
      address: "",
      name: "Token Page",
      symbol: "",
      decimals: "",
      totalSupply: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this._initAttrs(nextProps);
  }

  componentDidMount() {
    this._initAttrs(this.props);
  }

  _initAttrs(props) {
    const { address } = props.match.params;
    this.setState({ address: address }, () => {
      this._getAttrs();
    });
  }

  render() {
    return (
      <div style={Styles.Content}>
        <TopNav />
        <div style={Styles.TitleContent}>
          <text style={Styles.Title}>{this.state.name}</text>
          <text style={Styles.Title}>({this.state.symbol})</text>
        </div>
        <text style={Styles.Tip}>Interacting with token at address:</text>
        <text style={Styles.Tip}>{this.state.address}</text>
        <text style={Styles.Tip}>
          Total Supply is: {this.state.totalSupply}
        </text>
        <Transfers
          name={this.state.name}
          contractAddress={this.state.address}
        />
        <ApproveAccount contractAddress={this.state.address} />
        <CheckBalance contractAddress={this.state.address} />
        <TransferAllowance contractAddress={this.state.address} />
        <CheckAllowance contractAddress={this.state.address} />
      </div>
    );
  }

  _getAttrs() {
    getAttrs(this.state.address, "name")
      .then(name => this.setState({ name: name }))
      .catch(err => alert(err));
    getAttrs(this.state.address, "symbol")
      .then(name => this.setState({ symbol: name }))
      .catch(err => alert(err));
    getAttrs(this.state.address, "decimals")
      .then(name => this.setState({ decimals: name }))
      .catch(err => alert(err));
    getAttrs(this.state.address, "totalSupply")
      .then(name => this.setState({ totalSupply: name }))
      .catch(err => alert(err));
  }
}

const Styles = {
  Content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 30
  },
  Title: {
    fontSize: 24,
    marginTop: 20
  },
  Tip: {
    fontSize: 12,
    marginTop: 5
  },
  TitleContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
};
