import React, { useState, useRef } from 'react'

export default function SearchProfessorsBar(importVariables) {
    const [isFocused, setIsFocused] = useState(false);
    const searchComponentContainer = useRef(null);
    const searchComponentResultsContainer = useRef(null);
    const searchComponentInput = useRef(null);

    return (
        <div className='search-component-container'
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={searchComponentContainer}
        >
            <div className="search-component-input-container" tabIndex={0}>
                <input
                    value={importVariables.query}
                    id="search-component-input"
                    type="text"
                    placeholder='Izaberite profesora'
                    onChange={(e) => importVariables.setQuery(e.target.value)}
                    className='search-component-input'
                    ref={searchComponentInput}
                    autoComplete="off"
                />
                <label htmlFor="search-component-input" className='search-component-input-label'>
                    <span className="material-symbols-outlined">
                        person_search
                    </span>
                </label>


            </div>
            {isFocused &&
                <div className="search-component-results-container" ref={searchComponentResultsContainer}>
                    {importVariables.filtriraniProfesori.map(prof => {
                        return (
                            <option
                                value={prof._id}
                                key={prof._id}
                                onMouseDown={(e) => {
                                    if(importVariables.selectedProfessorChanged){
                                        importVariables.selectedProfessorChanged(e.target.value);
                                    }
                                    importVariables.setQuery(`${prof.title} ${prof.firstname} ${prof.lastname}`);
                                    searchComponentContainer.current.blur();
                                    searchComponentResultsContainer.current.blur();
                                    searchComponentInput.current.blur();
                                }}
                                className="search-component-result"
                            >
                                {prof.title} {prof.firstname} {prof.lastname}
                            </option>)
                    })}
                </div>
            }

        </div>
    )
}
