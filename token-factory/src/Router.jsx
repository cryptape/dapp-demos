import React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import Home from './containers/Home/index.jsx'
import Interact from './containers/Interact/index'
import Create from "./containers/Create/index";
import TokenPage from './containers/TokenPage/index'

const history = createBrowserHistory()

const router = App => (
    <Router history={history}>
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/interact" exact component={Interact} history={history}/>
            <Route path="/create" exact component={Create}/>
            <Route path="/token/:address" exact component={TokenPage}/>
        </Switch>
    </Router>
)

export default router
