import React from 'react'
import { useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
// ovo nije pravi provider samo sam ga tako nazvao zato sto daje context

export default function ProfessorsProvider() {

    const [professors, setProfessors] = useState([]);
    const [projects, setProjects] = useState([]);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProfessors = async () => {
            try {
                const response = await axiosPrivate.get('/professors', {
                    signal: controller.signal
                });
                isMounted && setProfessors(response.data);

            } catch (err) {
                console.error(err);
                console.log("professors provider.jsx error catch")
            }
        }

        getProfessors();

        const getProjects = async () => {
            try {
                const response = await axiosPrivate.get('/projects', {
                    signal: controller.signal
                });
                isMounted && setProjects(response.data);

            } catch (err) {
                console.error(err);
                console.log("(projects)professors provider.jsx error catch")
            }
        }

        getProjects();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    // console.log(professors);
    
    return <Outlet context={[professors, setProfessors, projects, setProjects]} />;
}
