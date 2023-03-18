import { createContext, useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useOutletContext } from 'react-router-dom'

const ProfContext = createContext({});

export const ProfProvider = ({ children }) => {
    const [professors, setProfessors] = useOutletContext();

    const [filtriraniProfesori, setFiltriraniProfesori] = useState(professors);
    const [query, setQuery] = useState('');
    const [opcijeScientificResearch, setOpcijeScientificResearch] = useState([]);
    const [opcijeLabaratories, setOpcijeLabaratories] = useState([]);
    const [opcijeScientificProjects, setOpcijeScientificProjects] = useState([]);
    const [opcijeSignificantPublications, setOpcijeSignificantPublications] = useState([]);

    const [showSortModal, setShowSortModal] = useState(false);
    function sortMax() {
        setShowSortModal(false);
        filtriraniProfesori.sort((a, b) => {
            return b.significantPublications.length - a.significantPublications.length;
        });
    }
    function sortMin() {
        setShowSortModal(false);
        filtriraniProfesori.sort((a, b) => {
            return a.significantPublications.length - b.significantPublications.length;
        });
    }
    useEffect(() => {
        setFiltriraniProfesori(professors);
    }, [professors]);

    useEffect(() => {
        const stariProfesori = [...professors];

        const filtriraniStariProfesori = stariProfesori.filter(professor => {
            if ((opcijeScientificResearch.length != 0) && professor.scientificResearch.some((el) => opcijeScientificResearch.includes(el))) {
                return true;
            }
            if ((opcijeLabaratories.length != 0) && professor.labaratories.some((el) => opcijeLabaratories.includes(el))) {
                return true;
            }
            if ((opcijeScientificProjects.length != 0) && professor.scientificProjects.some((el) => opcijeScientificProjects.includes(el))) {
                return true;
            }
            if ((opcijeSignificantPublications.length != 0) && professor.significantPublications.some((el) => opcijeSignificantPublications.includes(el))) {
                return true;
            }
            if ((opcijeScientificResearch.length == 0) && (opcijeLabaratories.length == 0) && (opcijeScientificProjects.length == 0) && (opcijeSignificantPublications.length == 0)) {
                return true;
            }
            return false;
            // mislim da je trenutno na unija, ako hoces presek zameni svuda return true i return false i zameni uslov drugi stavi uzvicnik ispred professor
        });

        setFiltriraniProfesori(filtriraniStariProfesori);
    }, [opcijeScientificResearch, opcijeLabaratories, opcijeScientificProjects, opcijeSignificantPublications]);

    return (
        <ProfContext.Provider value={{ professors, setProfessors }}>
            {children}
        </ProfContext.Provider>
    )
}

export default ProfContext;