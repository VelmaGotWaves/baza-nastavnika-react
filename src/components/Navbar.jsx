import React from 'react'
import useAuth from '../hooks/useAuth'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
export default function Navbar() {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/');
    }

    const { auth } = useAuth();
    return (
        <>
            <header className='navbar'>
                <div className="userDiv">
                    <span className="material-symbols-outlined">
                        person
                    </span><span>Hello,{auth.user}</span></div>
                <div className="professorsButtons">
                    <Link to='/professors'><button className='navButtons professorButton'>Profesori</button></Link>
                    <Link to='/professors/add'><button className='navButtons addProfessorButton'>Dodaj Profesora</button></Link>
                    <Link to='/professors/edit'><button className='navButtons editProfessorButton'>Izmeni Profesora</button></Link>
                    <Link to='/admin'><button className='navButtons adminsButton'>Admini</button></Link>
                </div>
                <button className='navButtons signoutButton' onClick={signOut}>Sign Out</button>

            </header>
            <Outlet />
        </>
    )
}
