import React, { Component } from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/Reducer";

import Search from "./components/Search";
import Results from "./components/Results"

import "./styles.css";

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);

class App extends Component {
  render() {
    return (
      <div className="app">
        <Search />
        <Results />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
