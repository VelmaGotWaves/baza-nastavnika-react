import React, { Fragment } from 'react'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useOutletContext, useParams } from 'react-router-dom';
import PdfGeneratorProfessors from '../PdfGeneratorProfessors';
import PdfGeneratorProjects from '../PdfGeneratorProjects';
import { keyToLabel } from '../data/keyToLabel';
export default function View() {
    const { subject, id } = useParams();
    const [professors, setProfessors, projects, setProjects] = useOutletContext();
    console.log(projects)

    const axiosPrivate = useAxiosPrivate();
    const getAneksi = async (selektovaniProjekat) => {

        if (!selektovaniProjekat.aneksi) {
            // setErrMsg("Invalid Professor Id");
            return;
        }


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
            console.error(err);
            console.log("users.jsx error catch")
        }
    }
    const getUgovor = async (selektovaniProjekat) => {

        if (!selektovaniProjekat.ugovor) {
            // setErrMsg("Invalid Professor Id");
            return;
        }


        try {
            const response = await axiosPrivate.get(`/ugovor/${selektovaniProjekat._id}`, {
                responseType: 'blob'
            });
            console.log(response)
            const contentType = response.headers['content-type']; // Get the content type of the response
  
            const fileExtension = '.' + contentType.split('/')[1];
            
            const blob = new Blob([response.data], { type: contentType });
            const url = URL.createObjectURL(blob);
          
            const link = document.createElement('a');
            link.href = url;
            link.download = `ugovor${fileExtension}`; // Set the appropriate file name and extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Remove the link element after clicking
          
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            console.log("ugovor download error")
        }
    }











    if (!subject || !id) {
        return <div>Niste dobro uneli link, "views/professor ili project/id projekta ili profesora"</div>
    }
    if (subject == "professor") {
        const selektovaniProfesor = professors.find(prof => prof._id == id);
        if (selektovaniProfesor) {
            const filtriraniProfesori = [selektovaniProfesor]

            return (
                <>
                    <div className='add-professor-page-container'>
                        <div className="add-professor-form-container">
                            <form className="add-professor-form" onSubmit={(e) => e.preventDefault()}>
                                <span className="add-professor-form-title">Pregledanje Profesora :MOZDA DODAJ IME OVDE:</span>
                                <hr className="add-professor-form-seperator" />

                                <div className='edit-professor-form-search-container'>
                                    {/* <SearchProfessorsBar query={query} setQuery={setQuery} filtriraniProfesori={filtriraniProfesori} selectedProfessorChanged={selectedProfessorChanged} /> */}

                                    {/* <button type='reset' disabled={!selectedId ? true : false} onClick={() => setViewDeleteModuo(prev => !prev)} className='edit-professor-form-delete-button'>Obriši profesora</button> */}
                                    {/* ovde ubaci pdf download */}
                                    {/* ovde ubaci excel */}
                                    <PdfGeneratorProfessors filtriraniProfesori={filtriraniProfesori} projects={projects} />
                                </div>

                                <div className="add-professor-form-inputs-container">
                                    <div className="add-professor-form-information-inputs-container">
                                        {Object.keys(selektovaniProfesor).map(key => {
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
                                <span className="add-professor-form-title">Pregledanje projekta :MOZDA DODAJ IME OVDE:</span>
                                <hr className="add-professor-form-seperator" />

                                <div className='edit-professor-form-search-container'>
                                    {/* ovde ubaci excel */}
                                    <PdfGeneratorProjects filtriraniProjekti={filtriraniProjekti} professors={professors} />
                                </div>

                                <div className="add-professor-form-inputs-container">
                                    <div className="add-professor-form-information-inputs-container">

                                        {Object.keys(selektovaniProjekat).map(key => {
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
                    <div className="add-professor-form-container">
                        <a onClick={() => getAneksi(selektovaniProjekat)}>klikni me za ANEKS?</a>
                        <a onClick={() => getUgovor(selektovaniProjekat)}>klikni me za ugovor?</a>

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
