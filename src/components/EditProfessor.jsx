import React, { useRef, useState, useEffect } from 'react'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useOutletContext, useParams } from 'react-router-dom';
import DeleteModuo from './DeleteModuo';
import SearchProfessorsBar from './SearchProfessorsBar';
import SuccessModuo from './SuccessModuo';

const FIRSTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{3,24})*$/;
const LASTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{3,24})*$/;
const TITLE_REGEX = /^[A-z-][A-z-_. ]{0,23}$/;
import { useFilter } from '@react-aria/i18n';

export default function EditProfessor() {
    const { id } = useParams();
    const [firstFire , setFirstFire]= useState(true);

    const [query, setQuery] = useState('');
    const [professors, setProfessors] = useOutletContext();
    const [filtriraniProfesori, setFiltriraniProfesori] = useState(professors);

    const axiosPrivate = useAxiosPrivate();
    const firstnameRef = useRef();
    useEffect(() => {
        firstnameRef.current.focus();
    }, [])

    const [selectedId, setSelectedId] = useState('')

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

    const [viewDeleteModuo, setViewDeleteModuo] = useState(false)

    const selectRef = useRef();

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
        if (selectedId == "") {
            setErrMsg("Invalid Professor Id");
            return;
        }
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
            const response = await axiosPrivate.patch("/professors", {
                id: selectedId,
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
            // TODO: remove console.logs before deployment
            //console.log(JSON.stringify(response?.data));
            // console.log(response.data)
            setSuccess(true);
            setProfessors(() => {
                const profWithoutTheOne = professors.filter(prof => prof._id != response.data._id)
                return [
                    ...profWithoutTheOne,
                    response.data]
            })

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('First and last names are required');
            } else {
                setErrMsg('Registration Failed');
            }
        }
    }

    const handleDelete = async (e) => {
        setErrMsg("");
        setSuccess(false);
        setViewDeleteModuo(false)
        console.log(selectedId)
        console.log(selectedId)
        if (selectedId == "") {
            setErrMsg("Invalid Professor Id");
            return;
        }

        try {
            const response = await axiosPrivate.delete("/professors",
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    data: {
                        id: selectedId
                    }
                }
            );
            // console.log(response.data)
            setSuccess(true);
            setSelectedId("");
            setFirstname("");
            setLastname("");
            setTitle("");
            setScientificResearch("");
            setLabaratories("");
            setSignificantPublications("");
            setScientificProjects("");
            selectRef.value = "";
            setTags("");
            setQuery("");
            setProfessors(() => {
                const profWithoutTheOne = professors.filter(prof => prof._id != response.data._id)
                return [
                    ...profWithoutTheOne
                ]
            })
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 404) {
                setErrMsg('Invalid Id');
            } else {
                setErrMsg('Deleting Failed');
            }
        }
    }

    function selectedProfessorChanged(value) {
        setSuccess(false);

        setSelectedId(value)
        // console.log(value)
        const selectedProfessorArray = professors.filter(prof => prof._id == value);
        if (selectedProfessorArray.length > 0) {
            const selectedProfessor = selectedProfessorArray[0];
            setFirstname(selectedProfessor.firstname);
            setLastname(selectedProfessor.lastname);
            setTitle(selectedProfessor.title);
            let tempScientificResearch = "";
            selectedProfessor.scientificResearch.map(sr => tempScientificResearch += sr + "!\n");
            setScientificResearch(tempScientificResearch);
            let tempLabaratories = "";
            selectedProfessor.labaratories.map(l => tempLabaratories += l + "!\n");
            setLabaratories(tempLabaratories);
            let tempSProj = "";
            selectedProfessor.scientificProjects.map(sproj => tempSProj += sproj + "!\n");
            setScientificProjects(tempSProj);
            let tempSP = "";
            selectedProfessor.significantPublications.map(sp => tempSP += sp + "!\n");
            setSignificantPublications(tempSP);
            let taggg = "";
            selectedProfessor.tags.map(tag => taggg += tag + "!\n");
            setTags(taggg);
            setQuery(`${selectedProfessor.title} ${selectedProfessor.firstname} ${selectedProfessor.lastname}`);
            setFirstFire(false);

        } else {
            setQuery("");
            setFirstname("");
            setLastname("");
            setTitle("");
            setScientificResearch("");
            setLabaratories("");
            setSignificantPublications("");
            setScientificProjects("");
            setTags("")
        }
    }

    useEffect(() => {
        // ovo moras da limitiras na jedan fire ovo je najveci error, ovo mora da se upali jednom i to je to
        if (id?.length == 24 && firstFire) {
            console.log('if ga je odradio')
            selectedProfessorChanged(id)
            // console.log(selectRef)
            // if (selectRef.key != id) {
            //     console.log(selectRef)
            //     selectRef.key = id;
            //     selectRef.value = id;

            // } OVO NE RADI POPRAVI, QUALITY OF LIFE, NISTA VISE
        }
    }, [id, professors])
    let { contains } = useFilter({
        sensitivity: 'base'
    });
    console.log(filtriraniProfesori)
    useEffect(() => {
        const stariProfesori = [...professors];
        console.log(stariProfesori)
        const filtriraniStariProfesori = stariProfesori.filter(professor => {
            if (query) {
                let title_firstname_lastname = professor.title + " " + professor.firstname + " " + professor.lastname;
                if (!(contains(title_firstname_lastname.toLowerCase(), query.toLowerCase()) || contains(professor.title.toLowerCase(), query.toLowerCase()) || contains(professor.lastname.toLowerCase(), query.toLowerCase()) || contains(professor.firstname.toLowerCase(), query.toLowerCase()) || contains(query.toLowerCase(), professor.firstname.toLowerCase()) || contains(query.toLowerCase(), professor.lastname.toLowerCase()) || contains(query.toLowerCase(), professor.title.toLowerCase()))) {
                    return false;
                }
            }
            return true;
        });

        setFiltriraniProfesori(filtriraniStariProfesori);
    }, [query, professors]);


    return (
        <>
            <div className='add-professor-page-container'>
                <div className="add-professor-form-container">
                    <form onSubmit={handleSubmit} className="add-professor-form">
                        <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                        <span className="add-professor-form-title">Izmeni Profesora</span>
                        <hr className="add-professor-form-seperator" />

                        <div className='edit-professor-form-search-container'>
                            <SearchProfessorsBar query={query} setQuery={setQuery} filtriraniProfesori={filtriraniProfesori} selectedProfessorChanged={selectedProfessorChanged}/>
                            
                            <button type='reset' disabled={!selectedId ? true : false} onClick={() => setViewDeleteModuo(prev => !prev)} className='edit-professor-form-delete-button'>Obriši profesora</button>

                        </div>

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


                        
                            <button type='submit' disabled={!validFirstname || !validLastname || !validTitle ? true : false} className="add-professor-form-button-submit">Izmeni profesora</button>
                        

                    </form>
                </div>
            </div>
            {viewDeleteModuo &&
                <DeleteModuo placeholder="professor" setViewDeleteModuo={setViewDeleteModuo} handleDelete={handleDelete} />
            }
            {success &&
                <SuccessModuo placeholder="izmenili profesora" setViewSuccessModuo={setSuccess} />
            }

        </>
    )
}
