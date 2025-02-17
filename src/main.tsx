// import { StrictMoe } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toast } from "antd-mobile";
import './index.css'
import "@/assets/styles/main.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { ToastInfo } from "@/components/ToastInfo/ToastInfo.tsx";
import CenteredLoading from "./components/CenterLoading.tsx";
Toast.config({ duration: 1000 });

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={<CenteredLoading />} persistor={persistor}>
        <App />
        <ToastInfo />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
