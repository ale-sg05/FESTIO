import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import { ProtectedRoute } from "./middleware/ProtectedRoute";
import { PublicRoute } from "./middleware/PublicRoute";

import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/404";

import EnterpriseSignIn from "@/pages/enterprise/SignIn";
import EnterpriseSignUp from "@/pages/enterprise/SignUp";
import EnterpriseDashboard from "./pages/enterprise/Dashboard";
import EnterpriseSettings from "@/pages/enterprise/Settings";

import EnterpriseFestivalIndex from "@/pages/enterprise/festival/EnterpriseFestivalIndex";
import EnterpriseFestivalDetail from "@/pages/enterprise/festival/EnterpriseFestivalDetail";

import ClientSignIn from "@/pages/client/SignIn";
import ClientSignUp from "@/pages/client/SignUp";
import ClientDashboard from "@/pages/client/Dashboard";
import ClientSettings from "@/pages/client/Settings";

import AdminSignIn from "@/pages/admin/SignIn";
import AdminDashboard from "@/pages/admin/Dashboard";
import ClientFestivals from "./pages/client/festivals/ClientFestivalIndex";
import ClientFestivalDetail from "./pages/client/festivals/ClientFestivalDetail";

import Index from "./pages/Index";
import Ticket from "./pages/client/ticket/Ticket";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route element={<PublicRoute />}>
          {/* <Route path="/login/admin" element={<AdminSignIn />} /> */}
          <Route path="/enterprise/login" element={<EnterpriseSignIn />} />
          <Route path="/enterprise/register" element={<EnterpriseSignUp />} />

          <Route path="/client/login" element={<ClientSignIn />} />
          <Route path="/client/register" element={<ClientSignUp />} />

          <Route path="/admin/login" element={<AdminSignIn />} />
        </Route>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["EMPRESA"]}
              redirectTo="/enterprise/login"
            />
          }
        >
          <Route path="/enterprise/" element={<EnterpriseDashboard />} />
          <Route
            path="/enterprise/settings/"
            element={<EnterpriseSettings />}
          />
          <Route
            path="/enterprise/festivals"
            element={<EnterpriseFestivalIndex />}
          />
          <Route
            path="/enterprise/festivals/:id"
            element={<EnterpriseFestivalDetail />}
          />
        </Route>
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["CLIENTE"]}
              redirectTo="/client/login"
            />
          }
        >
          <Route path="/client/" element={<ClientDashboard />} />
          <Route path="/client/settings/" element={<ClientSettings />} />
          <Route path="/client/festivals" element={<ClientFestivals />} />
          <Route
            path="/client/festivals/:id"
            element={<ClientFestivalDetail />}
          />
          <Route path="/client/ticket/:id" element={<Ticket />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
              redirectTo="/admin/login"
            />
          }
        >
          <Route path="/admin/" element={<AdminDashboard />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
