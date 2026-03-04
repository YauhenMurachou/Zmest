import { FC, Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';

import CorseError from 'src/components/common/atoms/corseError/CorseError';
import Loader from 'src/components/common/atoms/loader/Loader';
import DialogOpened from 'src/components/dialogs/dialogOpened/DialogOpened';
import { MaterialProvider } from 'src/providers/MaterialProvider';
import { initializedThunkCreator } from 'src/redux/appReducer';
import {
  startMessagesThunkCreator,
  stopMessagesThunkCreator,
} from 'src/redux/chatReducer';
import { RootState } from 'src/redux/redux-store';

import styles from './App.module.css';

const Header = lazy(() => import('./components/header/Header'));
const Navbar = lazy(() => import('./components/navbar/Navbar'));
const ProfileContainer = lazy(
  () => import('./components/profile/ProfileContainer')
);
const Dialogs = lazy(() => import('./components/dialogs/Dialogs'));
const StartPage = lazy(
  () => import('./components/common/atoms/startPage/StartPage')
);
const Photos = lazy(() => import('./components/photos/Photos'));
const Settings = lazy(() => import('./components/settings/Settings'));
const UsersContainer = lazy(() => import('./components/users/UsersContainer'));
const Login = lazy(() => import('./components/login/Login'));
const Friends = lazy(() => import('./components/friends/Friends'));
const ChatPage = lazy(() => import('./components/chat/ChatPageDefaultExport'));
const NotFound = lazy(() => import('./components/not-found/NotFound'));

const AppLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.appWrapper}>
    <Header />
    <Navbar />
    <div className={styles.appWrapperContent}>{children}</div>
  </div>
);

const appRoutes = [
  { path: '/Dialogs/:id', component: DialogOpened },
  { path: '/Dialogs', exact: true, component: Dialogs },
  { path: '/Profile/:userId?', component: ProfileContainer },
  { path: '/Photos', component: Photos },
  { path: '/Settings', component: Settings },
  { path: '/Users', component: UsersContainer },
  { path: '/Friends', component: Friends },
  { path: '/Chat', component: ChatPage },
  { path: '/', exact: true, component: StartPage },
];

const App: FC = () => {
  const dispatch = useDispatch();
  const { isInitialized, isCorseError } = useSelector(
    (state: RootState) => state.appReducer
  );
  const location = useLocation();

  useEffect(() => {
    dispatch(initializedThunkCreator());
  }, [dispatch]);

  useEffect(() => {
    dispatch(startMessagesThunkCreator());
  }, [dispatch, location]);

  useEffect(
    () => () => {
      dispatch(stopMessagesThunkCreator());
    },
    [dispatch, location]
  );

  return (
    <MaterialProvider>
      {isInitialized && (
        <Suspense fallback={<Loader isFetching />}>
          <Switch>
            <Route path="/login" component={Login} />
            {appRoutes.map(({ path, exact, component: Component }) => (
              <Route
                key={path}
                path={path}
                exact={exact}
                render={() => (
                  <AppLayout>
                    <Component />
                  </AppLayout>
                )}
              />
            ))}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      )}

      {!isInitialized && !isCorseError && (
        <Loader isFetching={!isInitialized} />
      )}
      {!isInitialized && isCorseError && <CorseError />}
    </MaterialProvider>
  );
};

export default App;
