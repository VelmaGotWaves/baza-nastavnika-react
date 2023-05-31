import React, { Fragment, useState } from 'react'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useOutletContext, useParams, Link } from 'react-router-dom';
import PdfGeneratorProfessors from '../PdfGeneratorProfessors';
import PdfGeneratorProjects from '../PdfGeneratorProjects';
import { keyToLabel } from '../data/keyToLabel';
export default function View() {
    const { subject, id } = useParams();
    const [professors, setProfessors, projects, setProjects] = useOutletContext();
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const getAneksi = async (selektovaniProjekat) => {
        if (!selektovaniProjekat) {
            setErrMsg("Nije izabran projekat.");
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return;
        }
        if (!selektovaniProjekat.aneksi) {
            setErrMsg("Ne postoje aneksi za izabrani projekat.");
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return;
        }


        // TODO U VIEW>JSX IMA MNOGO ERROR HANLEOVANJA DA SE POPRAVI POCEVSI OD setErrMsg koji nije ni napravljen i onda itd...
        try {
            const response = await axiosPrivate.get(`/aneksi/${selektovaniProjekat._id}`, {
                responseType: 'blob'
            });
            console.log(response)
            const blob = new Blob([response.data], { type: 'application/zip' });
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a');
            link.href = url;
            link.download = 'aneksi.zip';
            document.body.appendChild(link);
            link.click();
            document.body.appendChild(link);

            URL.revokeObjectURL(url);



        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Projekat ID je neophodan.');
            } else if (err.response?.status === 404) {
                setErrMsg('Projekat sa navedenim ID nije pronadjen.');
            } else if (err.response?.status === 500) {
                setErrMsg('Greska pri upravljanju fajlova na serveru.');
            } else if (err.response?.status === 410) {
                setErrMsg('Projekat nema anekse.');
            } else {
                setErrMsg('Akcija nije uspela');
            }
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    }
    const getUgovor = async (selektovaniProjekat) => {

        if (!selektovaniProjekat) {
            setErrMsg("Projekat nije izabran");
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return;
          }
          if (!selektovaniProjekat.ugovor) {
            setErrMsg("Projekat nema ugovor");
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return;
          }

        try {
            const response = await axiosPrivate.get(`/ugovor/${selektovaniProjekat._id}`, {
                responseType: 'blob'
            });
            console.log(response)
            const contentType = response.headers['content-type'];

            const fileExtension = '.' + contentType.split('/')[1];

            const blob = new Blob([response.data], { type: contentType });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `ugovor${fileExtension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
              } else if (err.response?.status === 400) {
                setErrMsg('Projekat ID je neophodan.');
              } else if (err.response?.status === 404) {
                setErrMsg('Projekat sa navedenim ID nije pronadjen.');
              } else if (err.response?.status === 500) {
                setErrMsg('Greska pri nalazenju fajla ugovora.');
              } else if (err.response?.status === 410) {
                setErrMsg('Nedostaje fajl ugovora.');
              } else {
                setErrMsg('Akcija nije uspela');
              }
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    }

    if (!subject || !id) {
        return <div>Niste dobro uneli link, "views/professor ili project/id projekta ili profesora"</div>
    }
    if (subject == "professor") {
        const selektovaniProfesor = professors.find(prof => prof._id == id);
        console.log(selektovaniProfesor)
        if (selektovaniProfesor) {
            const filtriraniProfesori = [selektovaniProfesor]

            return (
                <>
                    <div className='add-professor-page-container'>
                        <div className="add-professor-form-container">
                            <form className="add-professor-form" onSubmit={(e) => e.preventDefault()}>
                                <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                                <span className="add-professor-form-title">Pregledanje Profesora</span>
                                <hr className="add-professor-form-seperator" />

                                <div className='edit-professor-form-search-container'>
                                    {/* <SearchProfessorsBar query={query} setQuery={setQuery} filtriraniProfesori={filtriraniProfesori} selectedProfessorChanged={selectedProfessorChanged} /> */}

                                    {/* <button type='reset' disabled={!selectedId ? true : false} onClick={() => setViewDeleteModuo(prev => !prev)} className='edit-professor-form-delete-button'>Obriši profesora</button> */}
                                    {/* ovde ubaci pdf download */}
                                    {/* ovde ubaci excel */}
                                    <PdfGeneratorProfessors filtriraniProfesori={filtriraniProfesori} projects={projects} />
                                    <Link to={"/professors/edit/" + selektovaniProfesor._id}>
                                        <button className='professors-home-table-body-edit-cell-button'>
                                            <span className="material-symbols-outlined">
                                                edit
                                            </span>
                                            <span className='professors-home-table-body-edit-cell-button-span'>
                                                Izmeni
                                            </span>
                                        </button>
                                    </Link>
                                </div>

                                <div className="add-professor-form-inputs-container">
                                    <div className="add-professor-form-information-inputs-container">
                                        {Object.keys(selektovaniProfesor).map(key => {
                                            if (key == "projekti") {
                                                return (
                                                    <Fragment key={key}>
                                                        {/* proveri selektovaniProfesor.key kog je tipa i proveri da nije array ili object ili nesto tako, takodje stavi keyeve koje ignorises kao sto su aneksi i ugovor  */}
                                                        <label className="add-professor-form-label">
                                                            {keyToLabel[key]}
                                                        </label>
                                                        <span className='add-professor-form-name-input-description'>
                                                            {selektovaniProfesor[key].map(proj => {
                                                                const youveBeenFound = projects.find(project => project._id == proj.projekatId)
                                                                return (
                                                                    <span>{youveBeenFound?.nazivPrograma} {youveBeenFound?.nazivProjekta} //// {proj.uloga}<br /></span>
                                                                )
                                                            })}
                                                        </span>
                                                    </Fragment>
                                                )
                                            }
                                            return (
                                                <Fragment key={key}>
                                                    {/* proveri selektovaniProfesor.key kog je tipa i proveri da nije array ili object ili nesto tako, takodje stavi keyeve koje ignorises kao sto su aneksi i ugovor  */}
                                                    <label className="add-professor-form-label">
                                                        {keyToLabel[key]}
                                                    </label>
                                                    <span className='add-professor-form-name-input-description'>
                                                        {JSON.stringify(selektovaniProfesor[key])}
                                                    </span>
                                                </Fragment>
                                            )

                                        })}


                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>

                </>
            )
        } else {
            return (
                <div>Niste dobro uneli link, "views/professor/id (-ovde je greska)"</div>

            )
        }

    } else if (subject == "project") {
        const selektovaniProjekat = projects.find(proj => proj._id == id)
        if (selektovaniProjekat) {
            const filtriraniProjekti = [selektovaniProjekat]
            return (
                <>
                    <div className='add-professor-page-container'>
                        <div className="add-professor-form-container">
                            <form className="add-professor-form">
                                <span className="add-professor-form-title">Pregledanje projekta</span>
                                <hr className="add-professor-form-seperator" />

                                <div className='edit-professor-form-search-container'>
                                    {/* ovde ubaci excel */}
                                    <PdfGeneratorProjects filtriraniProjekti={filtriraniProjekti} professors={professors} />
                                    <Link to={"/projects/edit/" + selektovaniProjekat._id}>
                                        <button className='professors-home-table-body-edit-cell-button'>
                                            <span className="material-symbols-outlined">
                                                edit
                                            </span>
                                            <span className='professors-home-table-body-edit-cell-button-span'>
                                                Izmeni
                                            </span>
                                        </button>
                                    </Link>
                                </div>

                                <div className="add-professor-form-inputs-container">
                                    <div className="add-professor-form-information-inputs-container">
                                        <div className="add-professor-form-name-inputs-container">
                                            {
                                                selektovaniProjekat.ugovor ? (
                                                    <div className="add-professor-form-name-inputs-left">
                                                        <label className="add-professor-form-label">
                                                            Ugovor
                                                        </label>
                                                        <button type='button' onClick={() => getUgovor(selektovaniProjekat)} className='professors-home-table-body-edit-cell-button'>Download ugovor</button>

                                                        <span className='add-professor-form-name-input-description'>
                                                            Ugovor: {selektovaniProjekat.ugovor}
                                                        </span>

                                                    </div>
                                                ) : ""
                                            }
                                            {
                                                selektovaniProjekat.aneksi?.length ? (
                                                    <div className="add-professor-form-name-inputs-right">
                                                        <label className="add-professor-form-label">
                                                            Aneksi
                                                        </label>
                                                        <button type='button' onClick={() => getAneksi(selektovaniProjekat)} className='professors-home-table-body-edit-cell-button'>Download anekse</button> <br />

                                                        <span className='add-professor-form-name-input-description'>
                                                            Aneksi : {selektovaniProjekat.aneksi.toString().replace(",", ", ")}
                                                        </span>
                                                    </div>
                                                ) : ""
                                            }

                                        </div>

                                        {Object.keys(selektovaniProjekat).map(key => {
                                            if (key == "__v" || key == "_id" || key == "ugovor" || key == "aneksi") {
                                                return ""
                                            }
                                            if (key != "partnerskeInstitucije") {

                                                return (
                                                    <Fragment key={key}>
                                                        {/* proveri selektovaniProfesor.key kog je tipa i proveri da nije array ili object ili nesto tako, takodje stavi keyeve koje ignorises kao sto su aneksi i ugovor  */}
                                                        <label className="add-professor-form-label">
                                                            {keyToLabel[key]}
                                                        </label>
                                                        <span className='add-professor-form-name-input-description'>
                                                            {JSON.stringify(selektovaniProjekat[key])}
                                                        </span>
                                                    </Fragment>
                                                )
                                            }
                                            return (
                                                <Fragment key={key}>
                                                    {/* proveri selektovaniProfesor.key kog je tipa i proveri da nije array ili object ili nesto tako, takodje stavi keyeve koje ignorises kao sto su aneksi i ugovor  */}
                                                    <label className="add-professor-form-label">
                                                        {keyToLabel.partnerskeInstitucije.koordinator}
                                                    </label>
                                                    <span className='add-professor-form-name-input-description'>
                                                        {JSON.stringify(selektovaniProjekat.partnerskeInstitucije.koordinator)}
                                                    </span>
                                                    <label className="add-professor-form-label">
                                                        {keyToLabel.partnerskeInstitucije.partneri}
                                                    </label>
                                                    <span className='add-professor-form-name-input-description'>
                                                        {JSON.stringify(selektovaniProjekat.partnerskeInstitucije.partneri)}
                                                    </span>
                                                </Fragment>
                                            )

                                        })}

                                    </div>

                                </div>
                            </form>

                        </div>

                    </div>


                </>
            )
        } else {
            return <div>Niste dobro uneli link, "views/project/id (-ovde je greska)"</div>

        }

    } else {
        return (
            <div>Niste dobro uneli link, "views/professor ili project (-ovde je greska)/id projekta ili profesora</div>
        )
    }
}
