import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ThemeProvider, createTheme } from "@material-ui/core";

ReactDOM.render(
  <ThemeProvider theme={createTheme()}>
    <App />
  </ThemeProvider>,
  document.getElementById("root"),
);
