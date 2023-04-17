import React from 'react'

export default function SearchHomeBar(importVariables) {
    return (

        <div className="search-home-input-container" >
            <label htmlFor="search-home-input" className='search-home-input-label'>
                <span className="material-symbols-outlined search-home-input-icon">
                    person_search
                </span>
            </label>
            <input
                value={importVariables.query}
                id="search-home-input"
                type="text"
                placeholder='Pretraga'
                onChange={(e) => importVariables.setQuery(e.target.value)}
                className='search-home-input'
                autoComplete="off"
            />
        </div>



    )
}
