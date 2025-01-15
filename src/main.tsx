import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Toast } from "antd-mobile";
import '@/assets/styles/main.css'
Toast.config({ duration: 1000 });

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <App /></StrictMode>
)
