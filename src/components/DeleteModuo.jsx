import React from 'react'
// import ima placeholder, setviewdeletemoduo i funkciju za delete u mother componenti
export default function DeleteModuo(importVariables) {
    return (
        <div onClick={() => importVariables.setViewDeleteModuo(false)} className='deleteModuoBackground'>
            <div onClick={(e) => { e.stopPropagation() }} className='deleteModuo'>
                <div>
                    <h2>Delete</h2>
                </div>
                <hr/>
                <div>Are you sure you want to delete this {importVariables.placeholder}?</div>
                <hr/>
                <div className='deleteModuoButtons'>
                    <button onClick={() => importVariables.setViewDeleteModuo(false)}>CANCEL</button>
                    <button className='deleteModuoDeleteButton'onClick={() => {
                        importVariables.handleDelete()
                        importVariables.setViewDeleteModuo(false)
                        }}>DELETE</button>
                </div>

            </div>
        </div>
    )
}
