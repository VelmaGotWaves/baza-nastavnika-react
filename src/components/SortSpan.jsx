import React, { useState } from 'react'
import sortMax from '../images/sortMax.png'
import sortMin from '../images/sortMin.png'


export default function SortSpan(importVariables) {

  const [sortToggle, setSortToggle] = useState(false);

  function sort(){
    if(!sortToggle){
      importVariables.sortMax()
    } else {
      importVariables.sortMin()
    }
  }

  return (
    <th className='professors-home-table-head-cell notSelectable ' onClick={ () => {
      setSortToggle(()=>!sortToggle);
      sort();
      }}>
      <span>Broj Publikacija </span>
      
      {sortToggle?
      (<img src={sortMax} alt="" className="sort-arrows" />) :
      (<img src={sortMin} alt="" className="sort-arrows" />)
      }
    </th>

  )
}

