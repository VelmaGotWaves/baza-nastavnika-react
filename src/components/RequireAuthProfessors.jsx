import { useLocation, Navigate, Outlet, useOutletContext } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuthProfessors = ({ allowedRoles }) => {
    const { auth } = useAuth();
    //console.log(auth)
    const location = useLocation();
    //console.log(auth?.roles?.find(role => allowedRoles?.includes(role)))

    const [professors, useProfessors, projects, setProjects] = useOutletContext();

    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet context={[professors, useProfessors, projects, setProjects]}/>
            : auth?.accessToken //changed from user to accessToken to persist login after refresh
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuthProfessors;


