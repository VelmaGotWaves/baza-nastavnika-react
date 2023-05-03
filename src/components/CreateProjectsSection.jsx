import React from 'react';
import { useState, useEffect } from "react";
import SuccessModuo from './SuccessModuo';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const PROJECT_REGEX = /^[a-zA-Z0-9].*/;

export default function CreateProjectsSection() {
  const axiosPrivate = useAxiosPrivate();

  const [nazivProjekta, setNazivProjekta] = useState('');
  const [validProject, setValidProject] = useState(false);

  const [nazivPrograma, setNazivPrograma] = useState('');

  const [referentniBroj, setReferentniBroj] = useState('');

  const [errMsg, setErrMsg] = useState('');
  // const [success, setSuccess] = useState(false);
  const [viewSuccessModuo, setViewSuccessModuo] = useState(false)

  useEffect(() => {
    setValidProject(PROJECT_REGEX.test(nazivProjekta));
  }, [nazivProjekta])



  useEffect(() => {
    setErrMsg('');
  }, [nazivProjekta, nazivPrograma, referentniBroj])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!PROJECT_REGEX.test(nazivProjekta)) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axiosPrivate.post("/projects", {
        nazivProjekta,
        nazivPrograma,
        referentniBroj,
      },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,

        }
      );

      // setSuccess(true);
      setViewSuccessModuo(true);

      setNazivProjekta('');
      setNazivPrograma('');
      setReferentniBroj('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
    } else if (err.response?.status === 400) {
        setErrMsg('Project name is required');
    } else {
        setErrMsg('Registration Failed')
    }
    }
  }

  return (
    <>
      <div className='admin-create-container'>
        <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>

        <span className='admin-create-title'>Napravi projekat</span>
        <form onSubmit={handleSubmit} className='admin-create-form'>
          <div className="admin-create-form-container">
            <div className="admin-create-form-username-container">
              <label htmlFor="nprojekta" className='admin-create-form-label'>
                Naziv Projekta:
              </label>
              <input
                type="text"
                id="nprojekta"
                autoComplete="off"
                onChange={(e) => setNazivProjekta(e.target.value)}
                value={nazivProjekta}
                required
                className='admin-create-form-input'
                placeholder='Unesite naziv projekta'
              />
              <span className='admin-create-form-input-description'>
                Neophodno.
              </span>
            </div>
            <div className="admin-create-form-password-container">
              <label htmlFor="nprograma" className='admin-create-form-label'>
                Naziv programa:
              </label>
              <input
                type="text"
                id="nprograma"
                onChange={(e) => setNazivPrograma(e.target.value)}
                value={nazivPrograma}
                className='admin-create-form-input'
                placeholder='Unesite naziv programa'

              />
              <span className='admin-create-form-input-description'>
                Nije neophodo.
              </span>

              <label htmlFor="rbroj" className='admin-create-form-label'>
                Referentni broj:
              </label>
              <input
                type="text"
                id="rbroj"
                onChange={(e) => setReferentniBroj(e.target.value)}
                value={referentniBroj}
                className='admin-create-form-input'
                placeholder='Unesite referentni broj'

              />
              <span className='admin-create-form-input-description'>
                Nije neophodno.
              </span>
            </div>
          </div>

          <hr className='admin-display-seperator' />


          <button disabled={!validProject? true : false} className='admin-create-submit-button'>Kreiraj novi projekat</button>

        </form>
      </div>
      {viewSuccessModuo &&
        <SuccessModuo placeholder="dodali novi projekat" setViewSuccessModuo={setViewSuccessModuo} />
      }
    </>

  )
}
