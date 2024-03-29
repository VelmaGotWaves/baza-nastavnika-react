import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Layout from './components/wrappers/Layout';
import Admin from './components/pages/Admin';
import Missing from './components/pages/Missing';
import Unauthorized from './components/pages/Unauthorized';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/pages/Navbar';
import AddProfessor from './components/pages/AddProfessor';
import ProfessorsProvider from './context/ProfessorsProvider';
import EditProfessor from './components/pages/EditProfessor';
import ProfessorsHome from './components/pages/ProfessorsHome';
import RequireAuthProfessors from './components/RequireAuthProfessors';
// import { ProfProvider } from './context/ProfProvider';
import Projects from './components/pages/Projects';
import ProjectsHome from './components/pages/ProjectsHome';
import AddProject from './components/pages/AddProject';
import EditProject from './components/pages/EditProject';
import View from './components/pages/View';
// prebaci ovo kasnije u neki env ili nesto
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
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<Navbar />}>

            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="users" element={<Admin />} />
            </Route>
            
            <Route path="employees" element={<ProfessorsProvider />}>

              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
                <Route index
                  element={
                    // <ProfProvider>
                    <ProfessorsHome />
                    // </ProfProvider>
                  }
                />
              </Route>
              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                <Route path="add" element={<AddProfessor />} />
              </Route>
              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                <Route path="edit/:id?" element={<EditProfessor />} />
              </Route>
              

            </Route>
            
            <Route path="projects" element={<ProfessorsProvider />}>

              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
                <Route index element={
                <ProjectsHome />
                } />
              </Route>
              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                <Route path="add" element={<AddProject />} />
              </Route>
              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                <Route path="edit/:id?" element={<EditProject />} />
              </Route>


            </Route>

            <Route path="view" element={<ProfessorsProvider />}>
              <Route element={<RequireAuthProfessors allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
                <Route path=":subject?/:id?" element={<View />} />
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