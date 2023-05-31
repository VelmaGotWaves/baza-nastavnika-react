import React, { useState, useEffect } from 'react'
import { useFilter } from '@react-aria/i18n';
// ovaj je malo drugaciji od search specifif professors bar, ovaj je bas namenjen za edit, on change ne deselektuje profesora i kada se promeni id on updejtuje query
export default function SearchSpecificProjectBar({ projects, projectId, setProjectId }) {
    const [showModal, setShowModal] = useState(false);
  
  
    function turnOffModal(){
      setShowModal(false);
    }
    setTimeout(() => {
      if(showModal){
        window.addEventListener('click', turnOffModal)
      }
      else{
        window.removeEventListener('click', turnOffModal)
      }
    }, 0)
   
    useEffect(() => {
      const selektovan = projects.find(proj => proj._id == projectId)
      if(selektovan)
      setQuery(`${selektovan.nazivPrograma} ${selektovan.nazivProjekta}`)
    }, [projectId])
    
    //promenljive koje moras da dodas u ovaj kod i izbacis(nadjes nacin da smanjis) iz mother koda
    const [query, setQuery] = useState('');
    const [filtriraniProjekti, setFiltriraniProjekti] = useState(projects);
  
    let { contains } = useFilter({
      sensitivity: 'base'
    });
    useEffect(() => {
      const stariProjekti = [...projects];
      const filtriraniStariProjekti = stariProjekti.filter(proj => {
        if (query) {
          if (!(contains(proj.nazivProjekta.toLowerCase(), query.toLowerCase()) || contains(proj.nazivPrograma.toLowerCase(), query.toLowerCase()) || contains(`${proj.nazivPrograma.toLowerCase()} ${proj.nazivProjekta.toLowerCase()}`, query.toLowerCase()))) {
            return false;
          }
        }
        return true;
      });
  
      setFiltriraniProjekti(filtriraniStariProjekti);
    }, [query, projects]);
    return (
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
            placeholder='Izaberite projekat'
            onChange={(e) => {setQuery(e.target.value)}}
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
            {filtriraniProjekti.map(proj => {
              return (
                <option
                  value={proj._id}
                  key={proj._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    // if (importVariables.selectedProfessorChanged) {
                    //   importVariables.selectedProfessorChanged(e.target.value);
                    // } ovo je kod za slucaj kada se loaduje sa npr edit (onda ga loaduje ubacuje id i ovaj tekst dole, mozda ces morati da vratis)
                    setQuery(`${proj.nazivPrograma} ${proj.nazivProjekta}`);
                    setProjectId(proj._id);
                    setShowModal(false);
                    
                  }}
                  className="search-component-result"
                >
                  {proj.nazivPrograma} {proj.nazivProjekta}
                </option>)
            })}
          </div>
        }
  
      </div>
    )
}
