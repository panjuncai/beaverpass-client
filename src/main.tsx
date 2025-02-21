// import { StrictMoe } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toast } from "antd-mobile";
import './index.css'
import "@/assets/styles/main.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ToastInfo } from "@/components/ToastInfo/ToastInfo.tsx";

Toast.config({ duration: 1000 });

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <ToastInfo />
    </Provider>
  </BrowserRouter>
);
