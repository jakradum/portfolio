import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ButtonComponent } from "./Components/Button";
import { useState } from "react";
import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import RootLayout from "./tools";
import PWGenComponent from "./tools/strong-password-generator";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="tools/strong-password-generator" element={<PWGenComponent />} />
    </Route>
  )
);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
