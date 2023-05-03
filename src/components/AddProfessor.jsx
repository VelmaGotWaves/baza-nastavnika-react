import React, { useRef, useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SuccessModuo from './SuccessModuo';
import DropdownMultiSearch from './DropdownMultiSearch';
import DropdownMultiSearchID from './DropdownMultiSearchID';
import { katedreOptionsArray } from './data/katedre';
import { oblastiIstrazivanjaOptionsArray } from './data/oblastiIstrazivanja';

const FIRSTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{2,24})*$/;
const LASTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{2,24})*$/;
const TITLE_REGEX = /^[A-z-][A-z-_. ]{0,23}$/;


export default function AddProfessor() {
    const [professors, setProfessors, projects, setProjects] = useOutletContext();
    const axiosPrivate = useAxiosPrivate();
    const firstnameRef = useRef();
    useEffect(() => {
        firstnameRef.current.focus();
    }, [])

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


    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

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
        // provera da li su katedre uredu i dal su oblasti istrazivanja uredu


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
            const response = await axiosPrivate.post("/professors", {
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
            // console.log(JSON.stringify(response.data))
            setSuccess(true);
            setProfessors([
                ...professors,
                response.data
            ])
            setIme("");
            setPrezime("");
            setTitula("");
            setOpcijeOblastiIstrazivanja([]);
            setOpcijeKatedre([]);
            setOpcijePublikacije("");
            setOpcijeProjekti([]);
            setOpcijeTagovi([]);
            setTekstTagovi("");

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
                                <DropdownMultiSearch importArray={oblastiIstrazivanjaOptionsArray} uniqueSelectedItems={opcijeOblastiIstrazivanja} setUniqueSelectedItems={setOpcijeOblastiIstrazivanja} placeholder={"Izaberite oblasti"} />

                                <label htmlFor="tags" className="add-professor-form-label">
                                    Tagovi
                                </label>
                                <DropdownMultiSearch importArray={[...new Set(professors?.map(x => x.tagovi).flat(1))]} uniqueSelectedItems={opcijeTagovi} setUniqueSelectedItems={setOpcijeTagovi} placeholder={"Izaberite tagove"} />
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

                                <DropdownMultiSearch importArray={katedreOptionsArray} uniqueSelectedItems={opcijeKatedre} setUniqueSelectedItems={setOpcijeKatedre} placeholder={"Izaberite katedre"} />



                                <label htmlFor="scientificProjects" className="add-professor-form-label">
                                    Projekti
                                </label>
                                <span className='add-professor-form-information-input-description'>
                                    Potrebno je uneti projekte koje profesor trenutno vodi ili u njima učestvuje.
                                </span>
                                <DropdownMultiSearchID importArray={projects} uniqueSelectedItems={opcijeProjekti} setUniqueSelectedItems={setOpcijeProjekti} placeholder={"Izaberite projekte"} />

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

                        <button disabled={!validFirstname || !validLastname || !validTitle ? true : false} className="add-professor-form-button-submit">Dodaj profesora</button>

                    </form>
                </div>
            </div>
            {success &&
                <SuccessModuo placeholder="dodali profesora u nasu bazu" setViewSuccessModuo={setSuccess} />
            }
        </>
    )
}
