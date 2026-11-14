import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from "@/components/ui/toaster";
import React from 'react';

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
)
