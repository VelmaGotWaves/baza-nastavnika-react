import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddProfessor from './components/AddProfessor';
import ProfessorsProvider from './context/ProfessorsProvider';
import EditProfessor from './components/EditProfessor';
import ProfessorsHome from './components/ProfessorsHome';
import RequireAuthProfessors from './components/RequireAuthProfessors';
import { ProfProvider } from './context/ProfProvider';
import Projects from './components/Projects';
const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<Navbar />}>
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="admin" element={<Admin />} />
            </Route>

            <Route path="professors" element={<ProfessorsProvider />}>

              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                <Route index
                  element={
                    // <ProfProvider>
                      <ProfessorsHome />
                    // </ProfProvider>
                  }
                />
              </Route>

              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                <Route path="add" element={<AddProfessor />}/>
              </Route>
              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                <Route path="edit/:id?" element={<EditProfessor />}/>
              </Route>
              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                <Route path="projects" element={<Projects />}/>
              </Route>

            </Route>
          </Route>
        </Route>
        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );

}

export default App;