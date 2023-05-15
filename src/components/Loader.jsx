import React from 'react'

export default function Loader() {
    return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
    )
}

// implementiras ga tako sto, barem mislim, try{loading=true; axios...}catch{}finally{loading=false}