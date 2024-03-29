import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";

// routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";
import "./index.css";

// page imports
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Loader from "./components/Loader";

const BookTicket = lazy(() => import("./pages/BookTicket"));
const AdminLogin = lazy(() => import("./pages/Admin-login"));
const AdminPanel = lazy(() => import("./pages/Admin-panel"));

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter forceRefresh={true}>
      <Suspense fallback={Loader}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book-ticket" element={<BookTicket />} />
          <Route exact path="/user/:userid" element={<Users />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
