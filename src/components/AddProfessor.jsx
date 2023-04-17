import React, { useRef, useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SuccessModuo from './SuccessModuo';
const FIRSTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{3,24})*$/;
const LASTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{3,24})*$/;
const TITLE_REGEX = /^[A-z-][A-z-_. ]{0,23}$/;


export default function AddProfessor() {
    const [professors, setProfessors] = useOutletContext();
    const axiosPrivate = useAxiosPrivate();
    const firstnameRef = useRef();
    useEffect(() => {
        firstnameRef.current.focus();
    }, [])

    const [firstname, setFirstname] = useState('');
    const [validFirstname, setValidFirstname] = useState(false);

    const [lastname, setLastname] = useState('');
    const [validLastname, setValidLastname] = useState(false);

    const [title, setTitle] = useState('');
    const [validTitle, setValidTitle] = useState(false);

    const [scientificResearch, setScientificResearch] = useState('');
    const [labaratories, setLabaratories] = useState('');
    const [significantPublications, setSignificantPublications] = useState('');
    const [scientificProjects, setScientificProjects] = useState('');
    const [tags, setTags] = useState('');


    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidFirstname(FIRSTNAME_REGEX.test(firstname));
    }, [firstname])
    useEffect(() => {
        setValidLastname(LASTNAME_REGEX.test(lastname));
    }, [lastname])
    useEffect(() => {
        setValidTitle(TITLE_REGEX.test(title));
    }, [title])



    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setSuccess(false);
        if (!FIRSTNAME_REGEX.test(firstname)) {
            setErrMsg("Invalid First Name");
            return;
        }
        if (!LASTNAME_REGEX.test(lastname)) {
            setErrMsg("Invalid Last Name");
            return;
        }
        if (!TITLE_REGEX.test(title)) {
            setErrMsg("Invalid Title");
            return;
        }
        const scientificResearchArray = scientificResearch.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const scientificResearchArrayWithoutEmptyStrings = scientificResearchArray.filter((str) => {
            if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const scientificResearchFINAL = scientificResearchArrayWithoutEmptyStrings.map((str) => str.trim());

        const labaratoriesArray = labaratories.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const labaratoriesArrayWithoutEmptyStrings = labaratoriesArray.filter((str) => {
            if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const labaratoriesFINAL = labaratoriesArrayWithoutEmptyStrings.map((str) => str.trim());

        const scientificProjectsArray = scientificProjects.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const scientificProjectsArrayWithoutEmptyStrings = scientificProjectsArray.filter((str) => {
            if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const scientificProjectsFINAL = scientificProjectsArrayWithoutEmptyStrings.map((str) => str.trim());

        const significantPublicationsArray = significantPublications.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const significantPublicationsArrayWithoutEmptyStrings = significantPublicationsArray.filter((str) => {
            if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const significantPublicationsFINAL = significantPublicationsArrayWithoutEmptyStrings.map((str) => str.trim());

        const tagsArray = tags.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const tagsArrayWithoutEmptyStrings = tagsArray.filter((str) => {
            if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const tagsFINAL = tagsArrayWithoutEmptyStrings.map((str) => str.trim());

        //filter zbog nekog razloga nije hteo da radi, moja greska vrv, ovako mi je lakse da ostavim map
        try {
            const response = await axiosPrivate.post("/professors", {
                firstname: firstname,
                lastname: lastname,
                title: title,
                scientificResearch: scientificResearchFINAL,
                labaratories: labaratoriesFINAL,
                scientificProjects: scientificProjectsFINAL,
                significantPublications: significantPublicationsFINAL,
                tags: tagsFINAL
            },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,

                }
            );
            // console.log(JSON.stringify(response.data))
            setSuccess(true);
            setProfessors([
                ...professors,
                response.data
            ])
            setFirstname("");
            setLastname("");
            setTitle("");
            setScientificResearch("");
            setLabaratories("");
            setSignificantPublications("");
            setScientificProjects("");
            setTags("");

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('First and last names are required');
            } else {
                setErrMsg('Registration Failed')
            }
        }
    }

    return (
        <>


            <div className='add-professor-page-container'>
                <div className="add-professor-form-container">


                    <form className="add-professor-form" onSubmit={handleSubmit}>
                        <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                        <span className="add-professor-form-title">Dodaj novog profesora</span>
                        <hr className="add-professor-form-seperator" />
                        <div className="add-professor-form-inputs-container">
                            <div className="add-professor-form-name-inputs-container">
                                <div className="add-professor-form-name-inputs-left">
                                    <label htmlFor="firstname" className="add-professor-form-label">
                                        Ime
                                    </label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        ref={firstnameRef}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        value={firstname}
                                        required
                                        className='add-professor-form-name-input'
                                        placeholder='Unesite ime'
                                    />
                                    <span className='add-professor-form-name-input-description'>
                                        Mora početi slovom i može imati <br />od 3 do 24 karaktera
                                    </span>
                                    <label htmlFor="title" className="add-professor-form-label">
                                        Titula
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                        className='add-professor-form-name-input'
                                        placeholder='Unesite titulu'
                                    />
                                    <span className='add-professor-form-name-input-description'>
                                        Mora početi slovom i može imati <br />od 0 do 24 karaktera
                                    </span>
                                </div>
                                <div className="add-professor-form-name-inputs-right">
                                    <label htmlFor="lastname" className="add-professor-form-label">
                                        Prezime
                                    </label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        onChange={(e) => setLastname(e.target.value)}
                                        value={lastname}
                                        required
                                        className='add-professor-form-name-input'
                                        placeholder='Unesite prezime'
                                    />
                                    <span className='add-professor-form-name-input-description'>
                                        Mora početi slovom i može imati <br />od 3 do 24 karaktera
                                    </span>
                                </div>



                            </div>
                            <div className="add-professor-form-information-inputs-container">


                                <label htmlFor="scientificResearch" className="add-professor-form-label">
                                    Kategorije naučnog istraživanja
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je uneti područje znastvenog istraživanja. <a href="https://dl.acm.org/ccs">Ponuđena područja</a> <br />Svako područje je potrebno razdvojiti <b>zarezom.</b>
                                </span>
                                <textarea
                                    id="scientificResearch"
                                    onChange={(e) => setScientificResearch(e.target.value)}
                                    value={scientificResearch}
                                    className='add-professor-form-information-input'
                                    placeholder='Unesite kategorije'
                                />

                                <label htmlFor="tags" className="add-professor-form-label">
                                    Tags:
                                </label>
                                <textarea
                                    id="tags"
                                    onChange={(e) => setTags(e.target.value)}
                                    className='add-professor-form-information-input'
                                    value={tags}
                                    placeholder='Unesite tagove'
                                />
                                <label htmlFor="labaratories" className="add-professor-form-label">
                                    Labaratorije
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je uneti laboratorije u kojima profesor radi. Na kraj dodati voditeljstvo/članstvo.<br />Svako područje je potrebno razdvojiti <b>zarezom.</b>
                                </span>
                                <textarea
                                    className='add-professor-form-information-input'
                                    id="labaratories"
                                    onChange={(e) => setLabaratories(e.target.value)}
                                    value={labaratories}
                                    placeholder='Unesite labaratorije'

                                />



                                <label htmlFor="scientificProjects" className="add-professor-form-label">
                                    Naučni projekti
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je uneti projekte koje profesor trenutno vodi ili u njima učestvuje.<br />Svako područje je potrebno razdvojiti <b>zarezom.</b>
                                </span>
                                <textarea
                                    className='add-professor-form-information-input'

                                    id="scientificProjects"
                                    onChange={(e) => setScientificProjects(e.target.value)}
                                    value={scientificProjects}
                                    placeholder='Unesite naučne projekte'

                                />

                                <label htmlFor="significantPublications" className="add-professor-form-label">
                                    Najznačajnije publikacije
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je uneti najviše pet(5) najznačajnijih publikacija.<br />Svako područje je potrebno razdvojiti <b>zarezom.</b>
                                </span>
                                <textarea
                                    className='add-professor-form-information-input'

                                    id="significantPublications"
                                    onChange={(e) => setSignificantPublications(e.target.value)}
                                    value={significantPublications}
                                    placeholder='Unesite najznačajnije publikacije'
                                />

                            </div>

                        </div>
                        <hr className="add-professor-form-seperator" />

                        <button disabled={!validFirstname || !validLastname || !validTitle ? true : false} className="add-professor-form-button-submit">Dodaj profesora</button>

                    </form>
                </div>
            </div>
            {success &&
                <SuccessModuo placeholder="dodali profesora u nasu bazu" setViewSuccessModuo={setSuccess}/>
            }
        </>
    )
}
