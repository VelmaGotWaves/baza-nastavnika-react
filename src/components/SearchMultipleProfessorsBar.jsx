import React, { useState, useEffect, Fragment } from 'react'
import { useFilter } from '@react-aria/i18n';
// Poenta ovo komponente je samo to sto vraca id izabranog profesora i to je to, u ostalim komponentama bitan
// je selektovan profesor zato sto je punio polja itd, iskreno ovo bi moglo da se doda u editprof i samo 
// useEffect[profesorId] i to trigeruje selected professor changed ... milim da nije losa ideja to implementirati
// Takodje u ovom kodu ces umesto onFocus koristiti pravi nacin za klik, sa document.listen click itd...

export default function SearchMultipleProfessorsBar({ professors, professorIds, setProfessorIds }) {
    const [showModal, setShowModal] = useState(false);


    function turnOffModal() {
        setShowModal(false);
    }
    setTimeout(() => {
        if (showModal) {
            window.addEventListener('click', turnOffModal)
        }
        else {
            window.removeEventListener('click', turnOffModal)
        }
    }, 0)


    //promenljive koje moras da dodas u ovaj kod i izbacis(nadjes nacin da smanjis) iz mother koda
    const [query, setQuery] = useState('');
    const [filtriraniProfesori, setFiltriraniProfesori] = useState(professors);
    const [bulkProfessorIds, setBulkProfessorIds] = useState([]);

    useEffect(() => {
        setProfessorIds([... new Set(bulkProfessorIds)]);
    }, [bulkProfessorIds]);

    function removeProfId(id) {
        setQuery('');
        setBulkProfessorIds(prev => {
            return [...prev.filter(itemId => itemId != id)];
        })
    }



    let { contains } = useFilter({
        sensitivity: 'base'
    });
    useEffect(() => {
        const stariProfesori = [...professors];
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
            <div className='search-component-container'
                onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                }}
            >
                <div className="search-component-input-container">
                    <input
                        value={query}
                        type="text"
                        placeholder='Izaberite profesora'
                        onChange={(e) => { setQuery(e.target.value) }}
                        className='search-component-input'
                        autoComplete="off"
                    />
                    <label className='search-component-input-label'>
                        <span className="material-symbols-outlined">
                            person_search
                        </span>
                    </label>


                </div>
                {showModal &&
                    <div className="search-component-results-container">
                        {filtriraniProfesori.map(prof => {
                            return (
                                <option
                                    value={prof._id}
                                    key={prof._id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // if (importVariables.selectedProfessorChanged) {
                                        //   importVariables.selectedProfessorChanged(e.target.value);
                                        // } ovo je kod za slucaj kada se loaduje sa npr edit (onda ga loaduje ubacuje id i ovaj tekst dole, mozda ces morati da vratis)
                                        setQuery(`${prof.titula} ${prof.ime} ${prof.prezime}`);
                                        setBulkProfessorIds(prev => [...prev, prof._id]);
                                        setShowModal(false);
                                        setQuery('');

                                    }}
                                    className="search-component-result"
                                >
                                    {prof.titula} {prof.ime} {prof.prezime}
                                </option>)
                        })}
                    </div>
                }

            </div>
            {
                professorIds.map(profId => {
                    const individualProfessor = professors.filter(prof => prof._id == profId)[0];

                    return (
                        <span key={profId} className='add-professor-form-name-input-description notSelectable cursorPointer' onClick={() => removeProfId(profId)}>
                            {individualProfessor.titula} {individualProfessor.ime} {individualProfessor.prezime}
                            <span className="material-symbols-outlined">
                                close
                            </span>
                        </span>
                    )
                })
            }
        </>
    )
}
