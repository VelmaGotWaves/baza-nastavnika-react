import React, { useRef, useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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

        const tagsArray = tags.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
        const tagsArrayWithoutEmptyStrings = tagsArray.filter((str) => {
            if(str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
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
        <div className='addProfessor'>

            <form className="addProfessorForm" onSubmit={handleSubmit}>
                <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                <p className={success ? "sucmsg" : "offscreen"} >Success</p>
                <h1>Dodaj Profesora</h1>
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
                        <label htmlFor="tags">
                            Tags:
                        </label>
                        <textarea
                            cols="50"
                            rows="5"
                            id="tags"
                            onChange={(e) => setTags(e.target.value)}
                            value={tags}
                        />
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
                <button disabled={!validFirstname || !validLastname || !validTitle ? true : false}>Add a Professor</button>

            </form>
        </div>
    )
}
