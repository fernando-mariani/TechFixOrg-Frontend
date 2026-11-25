import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router";
import Login from './Screen/Login/Login';
import Cadastro from './Screen/Cadastro/Cadastro';
import Home from './Screen/Tecnico/Home/Home';
import Admin from './Screen/Admin/Admin';
import { AdminProvider } from './context/AdminContext';
import { TecnicoProvider } from './context/TecnicoContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/tecnico/home" element={<TecnicoProvider><Home /></TecnicoProvider>} />
        <Route path="/admin" element={<AdminProvider><Admin /></AdminProvider>} />
        <Route path="/about" element={<h1>About</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
