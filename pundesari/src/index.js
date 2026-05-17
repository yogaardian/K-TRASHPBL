import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import LandingPage from "views/LandingPage.js";
import AdminLayout from "layouts/Admin.js";
import Login from "views/Login.js";
import Register from "views/Register.js";
import LogoIcon from "./assets/LogoK-Trash.png";

// IMPORT PROVIDER
import {
  AuthProvider,
  DashboardProvider,
} from "./context/AppContext";

// User Flow
import UserDashboard from "views/user/UserDashboard.js";
import Profile from "views/user/Profile.js";
import History from "views/user/History.js";
import PickupPage from "views/user/PickupPage.js";
import SelectWaste from "views/user/SelectWaste.js";
import FindDriver from "views/user/FindDriver.js";
import TrackingPetugas from "views/user/TrackingPetugas.js";
import Saldo from "views/user/Saldo.js";
import HargaSampah from "views/user/HargaSampah.js";
import Marketplace from "views/user/Marketplace.js";

// Driver Flow
import DriverDashboard from "views/driver/DriverDashboard.js";
import OrderDetail from "views/driver/OrderDetail.js";
import TrackingUser from "views/driver/TrackingUser.js";

document.title = "K-Trash";

const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
faviconLink.type = 'image/png';
faviconLink.rel = 'shortcut icon';
faviconLink.href = LogoIcon;
if (!document.querySelector("link[rel*='icon']")) {
  document.head.appendChild(faviconLink);
}

ReactDOM.render(
  <AuthProvider>
    <DashboardProvider>
      <BrowserRouter>
        <Switch>

          {/* Landing */}
          <Route exact path="/" render={(props) => <LandingPage {...props} />} />

          {/* Login */}
          <Route path="/login" render={(props) => <Login {...props} />} />

          <Route path="/Register" render={(props) => <Register {...props} />} />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            render={(props) => <UserDashboard {...props} />}
          />

          <Route
            path="/user/profile"
            render={(props) => <Profile {...props} />}
          />

          <Route
            path="/user/history"
            render={(props) => <History {...props} />}
          />

          <Route
            path="/user/pickup"
            render={(props) => <PickupPage {...props} />}
          />

          <Route
            path="/user/select-waste"
            render={(props) => <SelectWaste {...props} />}
          />

          <Route
            path="/user/saldo"
            render={(props) => <Saldo {...props} />}
          />

          <Route
            path="/user/harga"
            render={(props) => <HargaSampah {...props} />}
          />

          <Route
            path="/user/marketplace"
            render={(props) => <Marketplace {...props} />}
          />

          <Route
            path="/user/notifications"
            render={() => <Redirect to="/user/profile" />}
          />

          <Route
            path="/user/find-driver"
            render={(props) => <FindDriver {...props} />}
          />

          <Route
            path="/user/tracking-petugas"
            render={(props) => <TrackingPetugas {...props} />}
          />

          {/* Driver Routes */}
          <Route
            path="/driver/dashboard"
            render={(props) => <DriverDashboard {...props} />}
          />

          <Route
            path="/driver/order/:id"
            render={(props) => <OrderDetail {...props} />}
          />

          <Route
            path="/driver/tracking-user"
            render={(props) => <TrackingUser {...props} />}
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            render={(props) => {
              const isLogin = localStorage.getItem("isLogin");
              const role = localStorage.getItem("role");

              if (!isLogin) {
                return <Redirect to="/login" />;
              }

              if (role !== "admin") {
                if (role === "petugas" || role === "driver") {
                  return <Redirect to="/driver/dashboard" />;
                }

                if (role === "user") {
                  return <Redirect to="/user/dashboard" />;
                }

                return <Redirect to="/login" />;
              }

              return <AdminLayout {...props} />;
            }}
          />

          <Redirect from="/" to="/login" />
        </Switch>
      </BrowserRouter>
    </DashboardProvider>
  </AuthProvider>,

  document.getElementById("root")
);