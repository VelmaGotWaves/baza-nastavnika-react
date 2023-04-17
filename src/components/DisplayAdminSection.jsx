import React from 'react'
import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteModuo from './DeleteModuo';
export default function DisplayAdminSection() {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const [viewDeleteModuo, setViewDeleteModuo] = useState(false);
    const [selectedId, setSelectedId] = useState();

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                // console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                console.log("users.jsx error catch")
                // navigate('/', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    async function deleteAdminButton() {
        // console.log(selectedId)
        try {
            const response = await axiosPrivate.delete('/users',
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    data: {
                        id: selectedId
                    }
                });
            // console.log(response.data);
            setSuccess(true);
            setUsers(() => {
                const usersWithoutTheOne = users.filter(user => user._id != response.data._id)
                return [
                    ...usersWithoutTheOne
                ]
            })
        } catch (err) {
            console.error(err);

            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('User ID required');
            } else if (err.response?.status === 404) {
                setErrMsg('User with the ID is not found');
            } else {
                setErrMsg('Failed to delete the user')
            }
        }

    }
    

    return (
        <>
            <div className='admin-display-container'>
                <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
                <p className={success ? "sucmsg" : "offscreen"} >Success</p>
                <span className='admin-display-title'>Lista administratora</span>
                <hr className='admin-display-seperator' />
                <table className='admin-display-table'>
                    <thead className='admin-display-table-head'>
                        <tr className='admin-display-table-head-row'>
                            <th className='admin-display-table-head-cell'>Username</th>
                            <th className='admin-display-table-head-cell'>Uloge</th>
                            <th className='admin-display-table-head-delete-cell'>Brisanje admina</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users?.map(user => {
                                // console.log(Object.keys(user.roles))
                                return (
                                    <tr className='admin-display-table-row' key={user._id} >
                                        <td className='admin-display-table-cell'>{user.username}</td>
                                        <td className='admin-display-table-cell'>{Object.keys(user.roles).map(key => key + " ")}</td>
                                        <td className='admin-display-table-delete-cell'>
                                            <button className='admin-display-table-delete-button' onClick={() => {
                                                setSelectedId(user._id)
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
                <DeleteModuo placeholder="admina" setViewDeleteModuo={setViewDeleteModuo} handleDelete={deleteAdminButton} />
            }
        </>
    )
}
