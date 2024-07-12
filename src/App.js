import ExplorerPage from './pages/ExplorerPage/Explorer';
import Home from './pages/HomePage/Home';
import Login from './pages/LoginPage/Login';
import "./global.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CodeEditor from './pages/CodeEditorPage/CodeEditor';
import NoPage from './pages/NoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="explorer" >
            <Route index element={<NoPage />} />
            <Route path=':path' element={<ExplorerPage />} />
          </Route>
          <Route path="editor" >
            <Route index element={<NoPage />} />
            <Route path=':path' element={<CodeEditor />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
