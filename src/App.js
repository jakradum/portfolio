import React from 'react';
import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import Home from './home'; 
import RootLayout from './tools/index'; 
import PWGenComponent from './tools/strong-password-generator';
import { TicTacToe } from './tools/tic-tac-toe';
import { ErrorElement } from './ErrorElement';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorElement/>} path="/" element={<Home />}>
      <Route path="/tools" element={<RootLayout />}>
        <Route path="/tools/strong-password-generator" element={<PWGenComponent />} />
        <Route path="/tools/tic-tac-toe" element={<TicTacToe />} />
      </Route>
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
