import React, { useRef, useState, useEffect } from 'react'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useOutletContext, useParams } from 'react-router-dom';
import DeleteModuo from './DeleteModuo';
const FIRSTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{3,24})*$/;
const LASTNAME_REGEX = /^[a-zA-ZčćžđšČĆŽĐŠ]{3,24}(?:[ -][a-zA-ZčćžđšČĆŽĐŠ]{3,24})*$/;
const TITLE_REGEX = /^[A-z-][A-z-_. ]{0,23}$/;

export default function EditProfessor() {
    const { id } = useParams();

    const [professors, setProfessors] = useOutletContext();

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
            if(str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const scientificResearchFINAL = scientificResearchArrayWithoutEmptyStrings.map((str) => str.trim());
        
        const labaratoriesArray = labaratories.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const labaratoriesArrayWithoutEmptyStrings = labaratoriesArray.filter((str) => {
            if(str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const labaratoriesFINAL = labaratoriesArrayWithoutEmptyStrings.map((str) => str.trim());

        const scientificProjectsArray = scientificProjects.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const scientificProjectsArrayWithoutEmptyStrings = scientificProjectsArray.filter((str) => {
            if(str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const scientificProjectsFINAL = scientificProjectsArrayWithoutEmptyStrings.map((str) => str.trim());

        const significantPublicationsArray = significantPublications.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const significantPublicationsArrayWithoutEmptyStrings = significantPublicationsArray.filter((str) => {
            if(str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
                return true
            }
        });
        const significantPublicationsFINAL = significantPublicationsArrayWithoutEmptyStrings.map((str) => str.trim());

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
                significantPublications: significantPublicationsFINAL
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
        // console.log(selectedId)
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
            setFirstname("");
            setLastname("");
            setTitle("");
            setScientificResearch("");
            setLabaratories("");
            setSignificantPublications("");
            setScientificProjects("");
            selectRef.value =""
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
            
        } else {
            setFirstname("");
            setLastname("");
            setTitle("");
            setScientificResearch("");
            setLabaratories("");
            setSignificantPublications("");
            setScientificProjects("");
        }
    }

    useEffect(() => {
        if (id?.length==24) {
            selectedProfessorChanged(id)
            // console.log(selectRef)
            // if (selectRef.key != id) {
            //     console.log(selectRef)
            //     selectRef.key = id;
            //     selectRef.value = id;

            // } OVO NE RADI POPRAVI, QUALITY OF LIFE, NISTA VISE
        }
    }, [id, professors])


    return (
        <>
            <div className='addProfessor'>

                <form onSubmit={handleSubmit} className="addProfessorForm">
                    <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                    <p className={success ? "sucmsg" : "offscreen"} >Success</p>
                    <h1>Izmeni Profesora</h1>
                    <select ref={selectRef} onChange={(e) => selectedProfessorChanged(e.target.value)}>
                        <option value="">Izaberite Profesora</option>
                        {professors.map(prof => {
                            return (
                                <option
                                    value={prof._id}
                                    key={prof._id}>
                                    {prof.title} {prof.firstname} {prof.lastname}
                                </option>)
                        })}
                    </select>
                    <div className="addProfessorFormInputsDiv">
                        <div>
                            <label htmlFor="firstname">
                                Ime:
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                ref={firstnameRef}
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstname}
                                required
                            />
                            <p >
                                3 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, hyphens, space allowed.
                            </p>
                            <label htmlFor="lastname">
                                Prezime:
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                onChange={(e) => setLastname(e.target.value)}
                                value={lastname}
                                required
                            />
                            <p >
                                3 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, hyphens, space allowed.
                            </p>
                            <label htmlFor="title">
                                Titula:
                            </label>
                            <input
                                type="text"
                                id="title"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                            <p >
                                0 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, hyphens, underscores, space and dots allowed.
                            </p>
                            <label htmlFor="scientificResearch">
                                Naucno Istrazivanje(Kategorije):
                            </label>
                            <textarea
                                cols="50"
                                rows="10"
                                id="scientificResearch"
                                onChange={(e) => setScientificResearch(e.target.value)}
                                value={scientificResearch}
                            />
                            <p >
                                Područje znanstvenog istraživanja.<br />
                                <a href="https://dl.acm.org/ccs">Ponudjena podrucja</a><br />
                                Svako podrucje razdvojiti znakom uzvika !
                            </p>
                        </div>
                        <div>
                            <label htmlFor="labaratories">
                                Labaratorije:
                            </label>
                            <textarea
                                cols="50"
                                rows="10"
                                id="labaratories"
                                onChange={(e) => setLabaratories(e.target.value)}
                                value={labaratories}
                            />
                            <p >
                                Labaratorije u kojima djeluje.<br />
                                Na kraj dodati (voditeljstvo/clastvno)<br />
                                Svako podrucje razdvojiti znakom uzvika !
                            </p>
                            <label htmlFor="scientificProjects">
                                Naucni Projekti:
                            </label>
                            <textarea
                                cols="50"
                                rows="10"
                                id="scientificProjects"
                                onChange={(e) => setScientificProjects(e.target.value)}
                                value={scientificProjects}
                            />
                            <p >
                                Popis znanstvenih projekata koje trenutno vodi ili u njima sudjeluje<br />
                                Svako podrucje razdvojiti znakom uzvika !
                            </p>
                            <label htmlFor="significantPublications">
                                Najznacajnije Publikacije:
                            </label>
                            <textarea
                                cols="50"
                                rows="10"
                                id="significantPublications"
                                onChange={(e) => setSignificantPublications(e.target.value)}
                                value={significantPublications}
                            />
                            <p >
                                Popis najviše pet najznačajnijih publikacija.<br />
                                Svako podrucje razdvojiti znakom uzvika !
                            </p>
                            
                        </div>
                    </div>



                    <button type='submit' disabled={!validFirstname || !validLastname || !validTitle ? true : false}>Confirm the changes</button>
                    <button type='reset' disabled={!selectedId ? true : false}onClick={() => setViewDeleteModuo(prev => !prev)}>Delete the Professor</button>
                </form>

            </div>
            {viewDeleteModuo &&
                <DeleteModuo placeholder="professor" setViewDeleteModuo={setViewDeleteModuo} handleDelete={handleDelete}/>
            }

        </>
    )
}
