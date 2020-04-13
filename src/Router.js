import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loading from "components/Loading.js";
import ErrorBoundary from "components/ErrorBoundary";

const Landing = React.lazy(() => import("pages/Landing"));
const my404 = React.lazy(() => import("pages/my404"));
const Login = React.lazy(() => import("pages/Login"));

toast.configure({
  position: toast.POSITION.TOP_CENTER,
  toastClassName: "p-5 text-green-500 bg-green-100 rounded w-full font-medium",
  autoClose: 5000,
});

export default function Router() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Landing} />
            <Route component={my404} />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  );
}
