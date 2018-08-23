/**
 * Created by 包俊 on 2018/8/14.
 */
import React from "react";
import TopNav from "../../components/TopNav/index";
import Input from "../../components/Input/index";
import Button from "../../components/Button/index";

const hint = "0x000000";

export default class Interact extends React.Component {
  constructor() {
    super();
    this.state = {
      input: "",
      button_status: true,
      button_text: "Go To Token"
    };
  }

  render() {
    return (
      <div style={Styles.Content}>
        <TopNav />
        <text style={Styles.Tip}>
          Enter the address of the token contract you want to interact with:
        </text>
        <Input
          title={"address"}
          value={hint}
          onKeyDown={e => this._enterPress(e)}
          inputChanged={input => {
            this.setState({ input: input });
          }}
        />
        <Button
          button_status={this.state.button_status}
          button_text={this.state.button_text}
          onClick={() => this._search()}
        />
      </div>
    );
  }

  _enterPress(e) {
    if (e.charCode === 13) {
      this._search();
    }
    if (e.keyCode === 13) {
      this._search();
    }
  }

  _search() {
    if (this.state.input !== "") {
      this.props.history.push("/token/" + this.state.input);
      this.setState({ button_text: "Searching...", button_status: false });
    }
  }
}

const Styles = {
  Content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  Tip: {
    marginTop: 40,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 12
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
  },
  Button: {
    marginTop: 10
  },
  Result: {
    marginTop: 30
  }
};
