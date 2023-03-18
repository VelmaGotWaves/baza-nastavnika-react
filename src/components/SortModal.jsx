import React from 'react'

export default function SortModal({ sortMax, sortMin}) {
    return (
        <div className='sortModal'>
            <ul>
                <li className='liItem'onClick={()=>sortMax()}>
                    Sortiraj Max <span className="material-symbols-outlined">arrow_upward</span>
                </li>
                <li className='liItem' onClick={()=>sortMin()}>
                    Sortiraj Min <span className="material-symbols-outlined">arrow_downward</span>
                </li>
            </ul>
        </div>
    )
}
