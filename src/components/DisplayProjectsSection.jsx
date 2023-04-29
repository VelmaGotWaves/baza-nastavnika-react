import React from 'react'
import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteModuo from './DeleteModuo';

export default function DisplayProjectsSection() {
    const [projects, setProjects] = useState();
    const axiosPrivate = useAxiosPrivate();

    const [viewDeleteModuo, setViewDeleteModuo] = useState(false);
    const [selectedId, setSelectedId] = useState();

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProjects = async () => {
            try {
                const response = await axiosPrivate.get('/projects', {
                    signal: controller.signal
                });
                // console.log(response.data);
                isMounted && setProjects(response.data);
            } catch (err) {
                console.error(err);
                console.log("users.jsx error catch")
                // navigate('/', { state: { from: location }, replace: true });
            }
        }

        getProjects();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    async function deleteProjectsButton() {
        // console.log(selectedId)
        try {
            const response = await axiosPrivate.delete('/projects',
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    data: {
                        id: selectedId
                    }
                });
            // console.log(response.data);
            setSuccess(true);
            setProjects(() => {
                const projectsWithoutTheOne = projects.filter(user => user._id != response.data._id)
                return [
                    ...projectsWithoutTheOne
                ]
            })
        } catch (err) {
            console.error(err);

            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Project ID required');
            } else if (err.response?.status === 404) {
                setErrMsg('Project with the ID is not found');
            } else {
                setErrMsg('Failed to delete the user');
            }
        }

    }
    

    return (
        <>
            <div className='admin-display-container'>
                <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                <p className={success ? "sucmsg" : "offscreen"} >Success</p>
                <span className='admin-display-title'>Lista projekta</span>
                <table className='admin-display-table'>
                    <thead className='admin-display-table-head'>
                        <tr className='admin-display-table-head-row'>
                            <th className='admin-display-table-head-cell'>Naziv programa</th>
                            <th className='admin-display-table-head-cell'>Naziv projekta</th>
                            <th className='admin-display-table-head-cell'>Referentni broj</th>
                            <th className='admin-display-table-head-delete-cell'>Brisanje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects?.map(project => {
                                // console.log(Object.keys(user.roles))
                                return (
                                    <tr className='admin-display-table-row' key={project._id} >
                                        <td className='project-display-table-cell-small'>{project.nazivPrograma}</td>
                                        <td className='project-display-table-cell-big'>{project.nazivProjekta}</td>
                                        <td className='project-display-table-cell-small'>{project.referentniBroj}</td>
                                        <td className='admin-display-table-delete-cell'>
                                            <button className='admin-display-table-delete-button' onClick={() => {
                                                setSelectedId(project._id)
                                                setViewDeleteModuo(true)
                                            }}>
                                                <span className="material-symbols-outlined">
                                                    delete_forever
                                                </span>
                                                <span>
                                                    Obriši
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

            </div>
            {viewDeleteModuo &&
                <DeleteModuo placeholder="admina" setViewDeleteModuo={setViewDeleteModuo} handleDelete={deleteProjectsButton} />
            }
        </>
    )
}
