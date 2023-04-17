import React from 'react'
import trash from '../images/trash.png'
import x from '../images/x.png'
// import ima placeholder, setviewdeletemoduo i funkciju za delete u mother componenti
export default function DeleteModuo(importVariables) {
    return (
        <div onClick={() => importVariables.setViewDeleteModuo(false)} className='delete-moduo-container'>
            <div onClick={(e) => { e.stopPropagation() }} className='delete-moduo'>
                <div className='delete-moduo-image-container'>
                    <img src={trash} alt="trash.png" className='delete-moduo-image-trash'/>
                    <img src={x} alt="x" onClick={() => importVariables.setViewDeleteModuo(false)} className='delete-moduo-image-x'/>
                </div>
                <span className='delete-moduo-title'>Brisanje {importVariables.placeholder}</span>
                <span className='delete-moduo-subtitle'>Da li ste sigurni da želite da obrišete {importVariables.placeholder}?</span>
                <div className='delete-moduo-buttons-container'>
                    <button onClick={() => importVariables.setViewDeleteModuo(false)} className='delete-moduo-buttons-cancel'>
                        Otkaži brisanje
                    </button>
                    <button className='delete-moduo-buttons-delete' onClick={() => {
                        importVariables.handleDelete()
                        importVariables.setViewDeleteModuo(false)
                    }} >
                        Obriši {importVariables.placeholder}
                    </button>
                </div>

            </div>
        </div>
    )
}
