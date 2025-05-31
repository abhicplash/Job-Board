import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./styles/global.css";
import { AuthProvider } from "./features/auth/AuthContext";  // <-- import AuthProvider

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>        
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
