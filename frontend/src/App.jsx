import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import SpotList from './components/SpotList/SpotList';
import SpotDetail from './components/SpotDetail/SpotDetail';
import SpotByUser from './components/SpotByUser/SpotByUser';
import SpotEdit from './components/SpotEdit'
import Navigation from './components/Navigation/Navigation-bonus';
import CreateSpot from './components/CreateSpot'
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotList />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetail />
      },
      {
        path: 'spots/new',
        element: <CreateSpot />
      },
      {
        path: 'spots/current',
        element: <SpotByUser />
      },
      {
        path: 'spots/:spotId/edit',
        element: <SpotEdit />
      },
      {
        path: 'reviews/current'
      },
      {
        path: '*',
        element: <h2>Page Not Found!</h2>
      }
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
