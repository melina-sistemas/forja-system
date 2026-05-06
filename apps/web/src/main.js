import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.js";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(
    BrowserRouter,
    null,
    React.createElement(App)
  )
);
