import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";
import SearchPage from "./pages/SearchPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="*" element={<section className="page-section"><div className="container narrow"><div className="page-card"><p className="eyebrow">Page not found</p><h1>This page doesn’t exist.</h1><a className="btn btn-primary" href="/">Return home</a></div></div></section>} />
      </Route>
    </Routes>
  );
}
