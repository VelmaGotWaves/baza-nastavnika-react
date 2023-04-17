import React from 'react'
import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import SuccessModuo from './SuccessModuo';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

export default function CreateAdminSection() {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    // const [success, setSuccess] = useState(false);
    const [viewSuccessModuo, setViewSuccessModuo] = useState(false)

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            // setSuccess(true);
                setViewSuccessModuo(true);

            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <div className='admin-create-container'>
                <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                
                <span className='admin-create-title'>Napravi administatora</span>
                <form onSubmit={handleSubmit} className='admin-create-form'>
                    <div className="admin-create-form-container">
                        <div className="admin-create-form-username-container">
                            <label htmlFor="username" className='admin-create-form-label'>
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                className='admin-create-form-input'
                                placeholder='Unesite username'
                            />
                            <span className='admin-create-form-input-description'>
                                Mora početi slovom i može imati od 4 do 24 karaktera
                            </span>
                        </div>
                        <div className="admin-create-form-password-container">
                            <label htmlFor="password" className='admin-create-form-label'>
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                className='admin-create-form-input'
                                placeholder='Unesite password'

                            />
                            <span className='admin-create-form-input-description'>
                                Mora imati velika i malo slova, broj i specijalni karakter.<br />Dozvoljeni specijalni karakteri su: !, @, #, $, %
                            </span>

                            <label htmlFor="confirm_pwd" className='admin-create-form-label'>
                                Confirm Password:
                            </label>
                            <input
                                type="password"
                                id="confirm_pwd"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                className='admin-create-form-input'
                                placeholder='Ponovo unesite password'

                            />
                            <span className='admin-create-form-input-description'>
                                Lozinka se mora poklapati sa prethodno kreiranom
                            </span>
                        </div>
                    </div>

                    <hr className='admin-create-seperator' />

                    <button disabled={!validName || !validPwd || !validMatch ? true : false} className='admin-create-submit-button'>Kreiraj novog admina</button>

                </form>
            </div>
            {viewSuccessModuo &&
                <SuccessModuo placeholder="kreirali novog admina" setViewSuccessModuo={setViewSuccessModuo} />
            }
        </>

    )
}
