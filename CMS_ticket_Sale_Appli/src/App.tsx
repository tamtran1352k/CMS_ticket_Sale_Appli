import React from "react";
import "./App.css";

import { Route, Routes } from "react-router-dom";

import MenuLayout from "./component/menu/Menu";
import DanhsachGoive from "./component/danhsachgoi/DanhsachGoive";
import DoiSoat from "./component/doisoat/Doisoat";
import DanhsachVe from "./component/danhsachve/DanhsachVe";
import EventsChart from "./component/home/Home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/menu" element={<MenuLayout />} />
        <Route path="/DanhsachGoive" element={<DanhsachGoive />} />
        <Route path="/DoiSoat" element={<DoiSoat />} />
        <Route path="/DanhsachVe" element={<DanhsachVe />} />
        <Route path="/" element={<EventsChart />} />
      </Routes>
    </div>
  );
}

export default App;
