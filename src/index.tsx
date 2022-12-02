import "./index.css";
import "./css/scrollbar.css";

import { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";

import App from "./App";
import { store } from "./redux/store";
import { ResponseInterceptors } from "./axios/interceptors";

function NavigateFunctionComponent() {
  // component needed to pass navigate function to axios interceptor
  // https://stackoverflow.com/a/70397967
  const navigate = useNavigate();
  const [ran, setRan] = useState(false);
  if (!ran) {
    ResponseInterceptors(navigate);
    setRan(true);
  }
  return <></>;
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <NavigateFunctionComponent />
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
