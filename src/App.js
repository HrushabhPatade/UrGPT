import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";
import Document from "./components/Document";
import Web from "./components/Web";
import Auth from "./components/Auth";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="chat" element={<Chat />} />
          <Route path="docQnA" element={<Document />} />
          <Route path="webQnA" element={<Web />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
