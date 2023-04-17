import React from 'react'
import success from '../images/success.png'
import x from '../images/x.png'

export default function SuccessModuo(importVariables) {
    return (
        <div onClick={() => importVariables.setViewSuccessModuo(false)} className='success-moduo-container'>
            <div onClick={(e) => { e.stopPropagation() }} className='success-moduo'>
                <div className='success-moduo-image-container'>
                    <img src={success} alt="success.png" className='success-moduo-image-success' />
                    <img src={x} alt="x" onClick={() => importVariables.setViewSuccessModuo(false)} className='success-moduo-image-x' />
                </div>
                <span className='success-moduo-title'>Sjajno!</span>
                <span className='success-moduo-subtitle'>Uspešno ste {importVariables.placeholder}!</span>
                <button onClick={() => importVariables.setViewSuccessModuo(false)} className='success-moduo-buttons-ok'>
                    OK
                </button>
            </div>
        </div>
    )
}
