import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Feed from "./pages/Feed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          {/* Add more routes as we create them */}
          <Route path="*" element={<div>Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
