import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router";
import Login from './Screen/Login/Login';
import Cadastro from './Screen/Cadastro/Cadastro';
import Home from './Screen/Tecnico/Home/Home';
import Admin from './Screen/Admin/Admin';
import Gerente from './Screen/Gerente/Gerente';
import { GerenteProvider } from './context/GerenteContext';
import { AdminProvider } from './context/AdminContext';
import { TecnicoProvider } from './context/TecnicoContext';
import Sidebar from './components/Sidebar';

function PortalLayout() {
  const { pathname } = useLocation();
  const isPublic = /^\/(?:login|cadastro)?\/?$/i.test(pathname);

  return (
    <div className={isPublic ? 'portal-layout portal-layout--public' : 'portal-layout'}>
      {!isPublic && <Sidebar />}
      <div className="portal-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/tecnico/home" element={<TecnicoProvider><Home /></TecnicoProvider>} />
          <Route path="/admin" element={<AdminProvider><Admin /></AdminProvider>} />
          <Route path="/gerente/home" element={<GerenteProvider><Gerente /></GerenteProvider>} />
          <Route path="/about" element={
            <main className="about-page">
              <div className="home-content">
                <section className="home-welcome">
                  <p className="home-eyebrow">Portal da equipe</p>
                  <h1>Sobre a TechFixOrg</h1>
                  <p>Portal interno para acompanhar pedidos de assistência técnica e organizar os reparos da equipe.</p>
                </section>
              </div>
            </main>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PortalLayout />
    </BrowserRouter>
  );
}
export default App;
