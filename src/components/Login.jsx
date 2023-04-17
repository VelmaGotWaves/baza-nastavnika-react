import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import axios from '../api/axios';
import pozadina from '../images/pozadina3.png'
const LOGIN_URL = '/auth';

const Login = () => {
    const { auth, setAuth, persist, setPersist } = useAuth();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
    }


    const navigate = useNavigate();

    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');



    useEffect(() => {
        // signOut();
        console.log(auth)
        if (auth.accessToken) {
            navigate('/professors');

        }
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd, persist }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(JSON.stringify(response?.data));
            // console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user: response?.data?.user, roles, accessToken, refreshTokenApp: response?.data?.refreshTokenApp });
            setUser('');
            setPwd('');
            // navigate(from, { replace: true });
            navigate('/', { replace: true });

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized: Wrong Username or Password');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    return (

        <div className="login-container">
            <img src={pozadina} alt="" className="login-wallpaper" />
            <div className="login-form-container">
                <div className="login-error-container">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                </div>
                <div className="login-title">Dobrodošli u Bazu profesora!</div>
                <div className="login-register-container">
                    <span className='login-register-text'>
                        Nemate nalog?
                    </span>

                    <Link to="/register">
                        <span className='login-register-link'>
                            Kreirajte ga
                        </span>
                    </Link>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="username" className='login-form-label'>Username</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        className='login-form-input'
                    />
                    <label htmlFor="password" className='login-form-label'>Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        className='login-form-input'
                    />
                    <div className="login-form-checkbox-container">
                        <input
                            type="checkbox"
                            id="persist"
                            onChange={togglePersist}
                            checked={persist}
                            className="login-form-checkbox"
                        />
                        <label htmlFor="persist" className="login-form-checkbox-label">Veruj ovom uređaju</label>
                    </div>
                    <button type='submit' className='login-form-submit'>Prijavi se</button>
                </form>
            </div>
        </div>

    )
}

export default Login
