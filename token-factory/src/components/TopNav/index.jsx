import React from "react";
import {Link} from "react-router-dom";

const TopNav = () => (
    <div style={Styles.Content}>
        <div>
            <Link to="/">
                <text style={Styles.Button}>Home</text>
            </Link>
        </div>
        <div>
            <Link to="/interact">
                <text style={Styles.Button}>Interact With Token Contract</text>
            </Link>
        </div>
        <div>
            <Link to="/create">
                <text style={Styles.Button}>Create Token Contract</text>
            </Link>
        </div>
    </div>
);
const Styles = {
    Content: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'center'
    },
    Button: {
        fontSize: 14,
        fontColor: "black"
    }
};
export default TopNav;
