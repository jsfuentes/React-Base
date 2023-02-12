import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ErrorBoundary from "src/components/ErrorBoundary";
import ErrorManager from "src/components/ErrorManager";
import Loading from "src/components/Loading";
import MyRedirect from "src/components/MyRedirect";
import UserRoute from "src/components/UserRoute";
import UserProvider from "src/contexts/UserProvider";
import { store } from "src/redux/store";
//These Routers will lazyload its children
import { componentLoader } from "src/utils/helpers";
const debug = require("debug")("app:Router");

const My404 = React.lazy(() =>
  componentLoader(() => import("src/pages/my404"))
);
const Login = React.lazy(() =>
  componentLoader(() => import("src/pages/Login"))
);
const Landing = React.lazy(() =>
  componentLoader(() => import("src/pages/Landing"))
);
const Dashboard = React.lazy(() =>
  componentLoader(() => import("src/pages/Dashboard"))
);

export default function Router() {
  // useEffect(() => {
  //   const metaFlashInfo: HTMLMetaElement | null = document.querySelector(
  //     "meta[name='flash-info']"
  //   );
  //   const metaFlashDanger: HTMLMetaElement | null = document.querySelector(
  //     "meta[name='flash-danger']"
  //   );

  //   const toastIfContent = (message: string) => message && toast(message);

  //   metaFlashInfo && toastIfContent(metaFlashInfo.content);
  //   metaFlashDanger && toastIfContent(metaFlashDanger.content);
  // }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <UserProvider>
          <ErrorManager>
            <ToastContainer
              bodyClassName="px-2 text-white font-medium w-full relative min-w-full "
              toastClassName="py-3 rounded bg-gray-900 flex items-center justify-center min-h-0 shadow-md " //disable default min height
              closeButton={false}
              position={toast.POSITION.TOP_CENTER}
              autoClose={7500} //false to disable
              closeOnClick={true}
              pauseOnHover={true}
              pauseOnFocusLoss={false}
            />

            <Suspense fallback={<Loading />}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />

                  {/* Redirect doesn't work on external links, https://stackoverflow.com/questions/42914666/react-router-external-link */}
                  <Route
                    path="/careers"
                    element={
                      <MyRedirect url="https://clayboard.notion.site/Careers-8b6817689d0e4b82b16fe8c9d31321a1" />
                    }
                  />

                  <Route path="/" element={<UserRoute />}>
                    <Route path="/dashboard/*" element={<Dashboard />} />
                  </Route>
                  <Route path="*" element={<My404 />} />
                </Routes>
              </BrowserRouter>
            </Suspense>
          </ErrorManager>
        </UserProvider>
      </Provider>
    </ErrorBoundary>
  );
}
