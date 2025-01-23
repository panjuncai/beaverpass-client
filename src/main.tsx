// import { StrictMoe } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toast } from "antd-mobile";
import "@/assets/styles/main.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext.tsx";
Toast.config({ duration: 1000 });

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
