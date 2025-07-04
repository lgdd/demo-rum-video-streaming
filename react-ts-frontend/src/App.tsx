import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Streaming from "@/pages/Streaming";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="streaming/:id/:playbackId/:title/:viewerUserId" element={<Streaming />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
