import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <AuthProvider>
         <Toaster theme="light" expand={true} richColors position="top-right" />
         <App />
      </AuthProvider>
   </StrictMode>
);
