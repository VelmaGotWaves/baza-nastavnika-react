import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

export default function Navbar() {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }
    const { pathname } = useLocation();
    const navDivs = document.body.querySelectorAll('.navbar-navigation-divs');

    useEffect(() => {
        windowChange();
    }, []);

    useEffect(() => {
        windowChange();
    }, [pathname, updateIndicatorLocation, navDivs]);
    window.addEventListener('resize', windowChange);

    function windowChange() {
        if (auth?.roles?.includes(ROLES.Admin)) {
            if (pathname.includes("professors/add")) {
                updateIndicatorLocation(1);
            } else if (pathname.includes("professors/edit")) {
                updateIndicatorLocation(2);
            } else if (pathname.includes("projects/add")) {
                updateIndicatorLocation(4);
            } else if (pathname.includes("projects/edit")) {
                updateIndicatorLocation(5);
            } else if (pathname.includes("professors")) {
                updateIndicatorLocation(0);
            } else if (pathname.includes("projects")) {
                updateIndicatorLocation(3);
            } else if (pathname.includes("users")) {
                updateIndicatorLocation(6);
            }
        } else if (auth?.roles?.includes(ROLES.Editor)) {
            if (pathname.includes("professors/add")) {
                updateIndicatorLocation(1);
            } else if (pathname.includes("professors/edit")) {
                updateIndicatorLocation(2);
            } else if (pathname.includes("projects/add")) {
                updateIndicatorLocation(4);
            } else if (pathname.includes("projects/edit")) {
                updateIndicatorLocation(5);
            } else if (pathname.includes("professors")) {
                updateIndicatorLocation(0);
            } else if (pathname.includes("projects")) {
                updateIndicatorLocation(3);
            }
        } else {
            if (pathname.includes("professors")) {
                updateIndicatorLocation(0);
            } else if (pathname.includes("projects")) {
                updateIndicatorLocation(1);
            } 
        }

    }

    function updateIndicatorLocation(n) {
        document.querySelector('.navbar-navigation-indicator').style.left = navDivs[n]?.getBoundingClientRect().left + "px";
        document.querySelector('.navbar-navigation-indicator').style.width = navDivs[n]?.getBoundingClientRect().width + "px";
        for (let i = 0; i < navDivs.length; i++) {
            navDivs[i]?.classList.remove('active');
        }
        navDivs[n]?.classList.add('active');
    }

    const { auth } = useAuth();
    const ROLES = {
        'User': 2001,
        'Editor': 1984,
        'Admin': 5150
      }
    return (
        <div>
            <div className='navbar'>
                <div className='navbar-header-container'>
                    <div className="navbar-header-user-container">
                        <span className="material-symbols-outlined">
                            account_circle
                        </span>
                        <span className="navbar-header-username">
                            {auth.user}
                        </span>
                    </div>
                    <span className="navbar-header-title">BAZA PROFESORA</span>
                    <div className="navbar-header-signout-container" onClick={signOut}>
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                        <span className="navbar-header-signout">Odjavi se</span>
                    </div>
                </div>
                <hr className="navbar-seperator" />
                <div className="navbar-navigation-container">
                    <div className="navbar-navigation-nav">

                        <Link to='/professors'>
                            <div className='navbar-navigation-divs'>Profesori</div>
                        </Link>

                        {auth?.roles?.includes(ROLES.Editor) ? (
                            <>
                                <Link to='/professors/add'>
                                    <div className='navbar-navigation-divs'>Dodaj Profesora</div>
                                </Link>
                                <Link to='/professors/edit'>
                                    <div className='navbar-navigation-divs'>Izmeni Profesora</div>
                                </Link>
                            </>
                        ) : ""}

                        <Link to='/projects'>
                            <div className='navbar-navigation-divs'>Projekti</div>
                        </Link>
                        {auth?.roles?.includes(ROLES.Editor) ? (
                            <>
                                <Link to='/projects/add'>
                                    <div className='navbar-navigation-divs'>Dodaj Projekte</div>
                                </Link>
                                <Link to='/projects/edit'>
                                    <div className='navbar-navigation-divs'>Izmeni Projekte</div>
                                </Link>
                            </>
                        ) : ""}
                        {auth?.roles?.includes(ROLES.Admin) ? (
                            <Link to='/users'>
                                <div className='navbar-navigation-divs'>Korisnici</div>
                            </Link>
                        ) : ""}

                    </div>

                </div>

            </div>
            <div className="navbar-navigation-seperator" >
                <div className="navbar-navigation-indicator"></div>
            </div>

            <Outlet />
        </div>
    )
}
