import React, { useRef, useState, useEffect } from 'react'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useOutletContext, useParams } from 'react-router-dom';
import DeleteModuo from '../DeleteModuo';
import SearchProfessorsBar from '../SearchProfessorsBar';
import SuccessModuo from '../SuccessModuo';
import DropdownMultiSearch from '../DropdownMultiSearch';
import DropdownMultiSearchID from '../DropdownMultiSearchID';
import { katedreOptionsArray } from '../data/katedre';
import { oblastiIstrazivanjaOptionsArray } from '../data/oblastiIstrazivanja';

const FIRSTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{2,24})*$/;
const LASTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{2,24})*$/;
const TITLE_REGEX = /^[A-z-][A-z-_. ]{0,23}$/;
import { useFilter } from '@react-aria/i18n';

export default function EditProfessor() {
    const { id } = useParams();
    const [firstFire, setFirstFire] = useState(true);

    const [query, setQuery] = useState('');
    const [professors, setProfessors, projects, setProjects] = useOutletContext();
    const [filtriraniProfesori, setFiltriraniProfesori] = useState(professors);

    const axiosPrivate = useAxiosPrivate();
    const firstnameRef = useRef();
    useEffect(() => {
        firstnameRef.current.focus();
    }, [])

    const [selectedId, setSelectedId] = useState('');

    const [ime, setIme] = useState('');
    const [validFirstname, setValidFirstname] = useState(false);

    const [prezime, setPrezime] = useState('');
    const [validLastname, setValidLastname] = useState(false);

    const [titula, setTitula] = useState('');
    const [validTitle, setValidTitle] = useState(false);

    const [opcijeOblastiIstrazivanja, setOpcijeOblastiIstrazivanja] = useState([]);
    const [opcijeKatedre, setOpcijeKatedre] = useState([]);
    const [opcijePublikacije, setOpcijePublikacije] = useState('');
    const [opcijeProjekti, setOpcijeProjekti] = useState([]);
    const [tekstTagovi, setTekstTagovi] = useState('');
    const [opcijeTagovi, setOpcijeTagovi] = useState([]);

    const [insertDataOblastiIstrazivanja, setInsertDataOblastiIstrazivanja] = useState([]);
    const [insertDataKatedre, setInsertDataKatedre] = useState([]);
    const [insertDataProjekti, setInsertDataProjekti] = useState([]);
    const [insertDataTagovi, setInsertDataTagovi] = useState([]);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [viewDeleteModuo, setViewDeleteModuo] = useState(false)

    const selectRef = useRef();

    useEffect(() => {
        setValidFirstname(FIRSTNAME_REGEX.test(ime));
    }, [ime])
    useEffect(() => {
        setValidLastname(LASTNAME_REGEX.test(prezime));
    }, [prezime])
    useEffect(() => {
        setValidTitle(TITLE_REGEX.test(titula));
    }, [titula])



    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setSuccess(false);
        if (selectedId == "" || selectedId.length != 24) {
            setErrMsg("Invalid Professor Id");
            return;
        }
        if (!FIRSTNAME_REGEX.test(ime)) {
            setErrMsg("Invalid First Name");
            return;
        }
        if (!LASTNAME_REGEX.test(prezime)) {
            setErrMsg("Invalid Last Name");
            return;
        }
        if (!TITLE_REGEX.test(titula)) {
            setErrMsg("Invalid Title");
            return;
        }

        const significantPublicationsArray = opcijePublikacije.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const significantPublicationsArrayWithoutEmptyStrings = significantPublicationsArray.filter((str) => {
            if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const significantPublicationsFINAL = significantPublicationsArrayWithoutEmptyStrings.map((str) => str.trim());

        const tagsArray = tekstTagovi.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const tagsArrayWithoutEmptyStrings = tagsArray.filter((str) => {
            if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const tagsALMOST = tagsArrayWithoutEmptyStrings.map((str) => str.trim());
        const tagsFINAL = [...new Set([...tagsALMOST, ...opcijeTagovi])];

        //filter zbog nekog razloga nije hteo da radi, moja greska vrv, ovako mi je lakse da ostavim map

        try {
            const response = await axiosPrivate.patch("/professors", {
                id: selectedId,
                ime: ime,
                prezime: prezime,
                titula: titula,
                oblastiIstrazivanja: opcijeOblastiIstrazivanja,
                katedre: opcijeKatedre,
                projekti: opcijeProjekti,
                publikacije: significantPublicationsFINAL,
                tagovi: tagsFINAL
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
        if (selectedId == "" || selectedId.length != 24) {
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
            setIme("");
            setPrezime("");
            setTitula("");
            setOpcijeOblastiIstrazivanja([]);
            setOpcijeKatedre([]);
            setOpcijePublikacije("");
            setOpcijeProjekti([]);
            setOpcijeTagovi([]);
            setTekstTagovi("");
            selectRef.value = "";
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
            setIme(selectedProfessor.ime);
            setPrezime(selectedProfessor.prezime);
            setTitula(selectedProfessor.titula);
            setQuery(`${selectedProfessor.titula} ${selectedProfessor.ime} ${selectedProfessor.prezime}`);
            setFirstFire(false);

            // setOpcijeOblastiIstrazivanja(selectedProfessor.oblastiIstrazivanja);
            // setOpcijeKatedre(selectedProfessor.katedre);
            // const projProj = projects.filter(pr => {
            //     if(selectedProfessor.projekti.some(projekat => projekat == pr._id))
            //     return pr
            // })
            // setOpcijeProjekti(projProj);
            // let tempSP = "";
            // console.log(selectedProfessor.publikacije)
            // selectedProfessor.publikacije.map(sp => tempSP += sp + "!\n");
            // setOpcijePublikacije(tempSP);
            // setOpcijeTagovi(selectedProfessor.tagovi);

            setInsertDataOblastiIstrazivanja(selectedProfessor.oblastiIstrazivanja)
            setInsertDataKatedre(selectedProfessor.katedre);
            const projProj = projects.filter(pr => {
                if (selectedProfessor.projekti.some(projekat => projekat.projekatId == pr._id))
                    return pr
            })
            setInsertDataProjekti(projProj);
            let tempSP = "";
            console.log(selectedProfessor.publikacije)
            selectedProfessor.publikacije.map(sp => tempSP += sp + "!\n");
            setOpcijePublikacije(tempSP);
            setInsertDataTagovi(selectedProfessor.tagovi);
        } else {
            setQuery("");
            setIme("");
            setPrezime("");
            setTitula("");
            setOpcijeOblastiIstrazivanja([]);
            setOpcijeKatedre([]);
            setOpcijePublikacije("");
            setOpcijeProjekti([]);
            setOpcijeTagovi([]);
            setTekstTagovi("");
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
                let title_firstname_lastname = professor.titula + " " + professor.ime + " " + professor.prezime;
                if (!(contains(title_firstname_lastname.toLowerCase(), query.toLowerCase()) || contains(professor.titula.toLowerCase(), query.toLowerCase()) || contains(professor.prezime.toLowerCase(), query.toLowerCase()) || contains(professor.ime.toLowerCase(), query.toLowerCase()) || contains(query.toLowerCase(), professor.ime.toLowerCase()) || contains(query.toLowerCase(), professor.prezime.toLowerCase()) || contains(query.toLowerCase(), professor.titula.toLowerCase()))) {
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
                            <SearchProfessorsBar query={query} setQuery={setQuery} filtriraniProfesori={filtriraniProfesori} selectedProfessorChanged={selectedProfessorChanged} />

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
                                        onChange={(e) => setIme(e.target.value)}
                                        value={ime}
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
                                        onChange={(e) => setTitula(e.target.value)}
                                        value={titula}
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
                                        onChange={(e) => setPrezime(e.target.value)}
                                        value={prezime}
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
                                    Oblasti istraživanjanja
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je izabrati područje znastvenog istraživanja.
                                </span>
                                <DropdownMultiSearch insertData={insertDataOblastiIstrazivanja} importArray={oblastiIstrazivanjaOptionsArray} uniqueSelectedItems={opcijeOblastiIstrazivanja} setUniqueSelectedItems={setOpcijeOblastiIstrazivanja} placeholder={"Izaberite oblasti"} />

                                <label htmlFor="tags" className="add-professor-form-label">
                                    Tagovi
                                </label>
                                <DropdownMultiSearch insertData={insertDataTagovi} importArray={[...new Set(professors?.map(x => x.tagovi).flat(1))]} uniqueSelectedItems={opcijeTagovi} setUniqueSelectedItems={setOpcijeTagovi} placeholder={"Izaberite tagove"} />
                                <span className='add-professor-form-information-input-description'>
                                    Ako zelite da dodate tagove koji <b>nisu</b> ponuđeni.<br />Svaki tag je potrebno razdvojiti <b>uzvičnikom!</b>
                                </span>
                                <textarea
                                    id="tags"
                                    onChange={(e) => setTekstTagovi(e.target.value)}
                                    className='add-professor-form-information-input'
                                    value={tekstTagovi}
                                    placeholder='Unesite tagove'
                                />


                                <label htmlFor="labaratories" className="add-professor-form-label">
                                    Katedre
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je uneti katedre u kojima profesor radi.
                                </span>
                                <DropdownMultiSearch insertData={insertDataKatedre} importArray={katedreOptionsArray} uniqueSelectedItems={opcijeKatedre} setUniqueSelectedItems={setOpcijeKatedre} placeholder={"Izaberite katedre"} />



                                <label htmlFor="scientificProjects" className="add-professor-form-label">
                                    Projekti
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je uneti projekte koje profesor trenutno vodi ili u njima učestvuje.
                                </span>
                                <DropdownMultiSearchID insertData={insertDataProjekti} importArray={projects} uniqueSelectedItems={opcijeProjekti} setUniqueSelectedItems={setOpcijeProjekti} placeholder={"Izaberite projekte"} />


                                <label htmlFor="significantPublications" className="add-professor-form-label">
                                    Publikacije
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je uneti publikacije.<br />Svaku publikaciju je potrebno razdvojiti <b>uzvičnikom!</b>
                                </span>
                                <textarea
                                    className='add-professor-form-information-input'

                                    id="significantPublications"
                                    onChange={(e) => setOpcijePublikacije(e.target.value)}
                                    value={opcijePublikacije}
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
