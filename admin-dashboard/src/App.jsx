import Layout from "./components/layout";
import Courses from "./page/Courses";
import Home from "./page/Home";
import ProfilePage from "./page/Profile";
import Users from "./page/User";
import TestManagement from "./page/testmanagerment";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/test-management"
          element={
            <Layout>
              <TestManagement />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/courses"
          element={
            <Layout>
              <Courses />
            </Layout>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
