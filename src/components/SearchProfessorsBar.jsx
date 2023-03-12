import React, {useState} from 'react'

export default function SearchProfessorsBar(importVariables) {
    return (
        <div className="searchInputDiv">
            <input value={importVariables.query} type="text" placeholder='Search:' onChange={(e) => importVariables.setQuery(e.target.value)} />
            <span className="material-symbols-outlined">
                search
            </span>

        </div>
    )
}
