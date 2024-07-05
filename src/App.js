import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './home';
import RootLayout from './tools/index';
import PWGenComponent from './tools/strong-password-generator';
import { TicTacToe } from './tools/tic-tac-toe';
import { ErrorElement } from './ErrorElement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: 'tools',
        element: <RootLayout />,
        children: [
          {
            path: 'strong-password-generator',
            element: <PWGenComponent />,
          },
          {
            path: 'tic-tac-toe',
            element: <TicTacToe />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;