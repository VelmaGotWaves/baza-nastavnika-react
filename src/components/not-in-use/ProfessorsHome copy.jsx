import React, { useState, useEffect, useRef } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import SearchProfessorsBar from '../SearchProfessorsBar';
import DropdownMultiSelect from './DropdownMultiSelect';
import exportFromJSON from 'export-from-json'
import PdfGenerator from '../PdfGenerator';
import SortModal from '../SortModal'
// import useProf from '../hooks/useProf';
import { useFilter } from '@react-aria/i18n';

function exportJson(data1) {
  data1.forEach(element => {
    delete element._id
    delete element.__v
  });
  const data = data1
  const fileName = 'download'
  const exportType = 'xls'
  exportFromJSON({ data, fileName, exportType })
}

export default function ProfessorsHome() {
  const [professors, setProfessors] = useOutletContext();
  // const {professors, setProfessors} = useProf();
  const [filtriraniProfesori, setFiltriraniProfesori] = useState(professors);
  const [query, setQuery] = useState('');
  const [opcijeScientificResearch, setOpcijeScientificResearch] = useState([]);
  const [opcijeLabaratories, setOpcijeLabaratories] = useState([]);
  const [opcijeScientificProjects, setOpcijeScientificProjects] = useState([]);
  const [opcijeSignificantPublications, setOpcijeSignificantPublications] = useState([]);
  const [opcijeTags, setOpcijeTags] = useState([]);

  const [showSortModal, setShowSortModal] = useState(false);
  function sortMax() {
    setShowSortModal(false);
    filtriraniProfesori.sort((a, b) => {
      return b.significantPublications.length - a.significantPublications.length;
    });
  }
  function sortMin() {
    setShowSortModal(false);
    filtriraniProfesori.sort((a, b) => {
      return a.significantPublications.length - b.significantPublications.length;
    });
  }


  let { contains } = useFilter({
    sensitivity: 'base'
  });

  useEffect(() => {
    const stariProfesori = [...professors];

    const filtriraniStariProfesori = stariProfesori.filter(professor => {
      // if(query){
      //   let title_firstname_lastname = professor.title + " " + professor.firstname + " " +professor.lastname;
      //   if(!(title_firstname_lastname.toLowerCase().includes(query.toLowerCase()) ||professor.title.toLowerCase().includes(query.toLowerCase()) ||professor.lastname.toLowerCase().includes(query.toLowerCase()) ||professor.firstname.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(professor.firstname.toLowerCase()) || query.toLowerCase().includes(professor.lastname.toLowerCase()) || query.toLowerCase().includes(professor.title.toLowerCase()))){
      //     return false
      //   }
      // }
      if (query) {
        let title_firstname_lastname = professor.title + " " + professor.firstname + " " + professor.lastname;
        if (!(contains(title_firstname_lastname.toLowerCase(), query.toLowerCase()) || contains(professor.title.toLowerCase(), query.toLowerCase()) || contains(professor.lastname.toLowerCase(), query.toLowerCase()) || contains(professor.firstname.toLowerCase(), query.toLowerCase()) || contains(query.toLowerCase(), professor.firstname.toLowerCase()) || contains(query.toLowerCase(), professor.lastname.toLowerCase()) || contains(query.toLowerCase(), professor.title.toLowerCase()))) {
          return false
        }
      }
      if ((opcijeScientificResearch.length == 0) && (opcijeLabaratories.length == 0) && (opcijeScientificProjects.length == 0) && (opcijeSignificantPublications.length == 0) && (opcijeTags.length == 0)) {
        return true;
      }
      if ((opcijeScientificResearch.length != 0) && professor.scientificResearch.some((el) => opcijeScientificResearch.includes(el))) {
        return true;
      }
      if ((opcijeLabaratories.length != 0) && professor.labaratories.some((el) => opcijeLabaratories.includes(el))) {
        return true;
      }
      if ((opcijeScientificProjects.length != 0) && professor.scientificProjects.some((el) => opcijeScientificProjects.includes(el))) {
        return true;
      }
      if ((opcijeSignificantPublications.length != 0) && professor.significantPublications.some((el) => opcijeSignificantPublications.includes(el))) {
        return true;
      }
      if ((opcijeTags.length != 0) && professor.tags.some((el) => opcijeTags.includes(el))) {
        return true;
      }

      return false;
      // mislim da je trenutno na unija, ako hoces presek zameni svuda return true i return false i zameni uslov drugi stavi uzvicnik ispred professor
    });

    setFiltriraniProfesori(filtriraniStariProfesori);
  }, [opcijeScientificResearch, opcijeLabaratories, opcijeScientificProjects, opcijeSignificantPublications, query, professors, opcijeTags]);


  return (
    <div className="professors-home-container">
      <div className="professors-home-filters-container">
        <span className="professors-home-filters-title">Napredna pretraga</span>
        {/* dal cu search koristiti jos se pitam, vrv je nebitan za ovu aplikaciju, trenutno postoji vizuelno ali nije povezan na back, mogu eventualno da ga povezem na ime i prezime */}
        <DropdownMultiSelect uniqueSelectedItems={opcijeScientificResearch} setUniqueSelectedItems={setOpcijeScientificResearch} placeholder={"Naucno Istrazivanje"} nizOpcija={professors?.map(x => x.scientificResearch)} />
        <DropdownMultiSelect uniqueSelectedItems={opcijeLabaratories} setUniqueSelectedItems={setOpcijeLabaratories} placeholder={"Labaratorije"} nizOpcija={professors?.map(x => x.labaratories)} />
        <DropdownMultiSelect uniqueSelectedItems={opcijeScientificProjects} setUniqueSelectedItems={setOpcijeScientificProjects} placeholder={"Naucni Projekti"} nizOpcija={professors?.map(x => x.scientificProjects)} />
        <DropdownMultiSelect uniqueSelectedItems={opcijeSignificantPublications} setUniqueSelectedItems={setOpcijeSignificantPublications} placeholder={"Najznacajnije Publikacije"} nizOpcija={professors?.map(x => x.significantPublications)} />
        <DropdownMultiSelect uniqueSelectedItems={opcijeTags} setUniqueSelectedItems={setOpcijeTags} placeholder={"Tags"} nizOpcija={professors?.map(x => x.tags)} />


      </div>
      <div className="professors-home-content-container">
        <div className="professors-home-content-title-container">
          <span className="professors-home-content-title">Lista profesora</span>
        </div>
        <div className="professors-home-content-utils-container">
          <SearchProfessorsBar query={query} setQuery={setQuery} filtriraniProfesori={filtriraniProfesori} selectedProfessorChanged={null} />
          <div className="professors-home-content-utils-buttons-container">
            <button className='xlsResultBtn' onClick={() => exportJson(filtriraniProfesori)}>Eksportuj u XLS</button>
            <PdfGenerator filtriraniProfesori={filtriraniProfesori} />
          </div>
          
        </div>
        <div className="professors-home-table-container">
          <table className='professors-home-table'>
            <thead className='professors-home-table-head'>
              <tr className='professors-home-table-head-row'>
                <th className='professors-home-table-head-cell'>Titula</th>
                <th className='professors-home-table-head-cell'>Ime i Prezime</th>
                <th className='professors-home-table-head-cell'>Naučno Istrazivanje -Kategorije</th>
                <th className='professors-home-table-head-cell'>Labaratorije</th>
                <th className='professors-home-table-head-cell'>Naučni projekti</th>
                <th className='professors-home-table-head-cell'>Najznačajnije publikacije</th>
                <th className='professors-home-table-head-cell'>Tagovi</th>
                <th className='professors-home-table-head-cell notSelectable' onClick={() => setShowSortModal(() => !showSortModal)}>
                  <span>
                    Broj Publikacija
                  </span>
                  <span className="material-symbols-outlined">
                    sort
                  </span>
                  {showSortModal && <SortModal sortMin={sortMin} sortMax={sortMax} />}
                </th>
                <th className='professors-home-table-head-cell notSelectable'>Izmeni</th>
              </tr>
            </thead>
            <tbody className='professors-home-table-body'>
              { // ovde rezultat
                filtriraniProfesori?.map(professor => {

                  return (
                    <tr className='professors-home-table-body-row' key={professor._id} >
                      <td className='professors-home-table-body-cell'>{professor.title} {professor.firstname} {professor.lastname}</td>
                      <td className='professors-home-table-body-cell'>{professor.scientificResearch[0]}</td>
                      <td className='professors-home-table-body-cell'>{professor.labaratories[0]}</td>
                      <td className='professors-home-table-body-cell'>{professor.scientificProjects[0]}</td>
                      <td className='professors-home-table-body-cell'>{professor.significantPublications[0]}</td>
                      <td className='professors-home-table-body-cell'>{professor.tags[0]}</td>
                      <td className='professors-home-table-body-cell'>{professor.significantPublications.length} </td>
                      <td className='professors-home-table-body-cell'>
                        <Link to={"/professors/edit/" + professor._id}>
                          <button className='professors-home-table-body-cell-edit'>Izmeni</button>
                        </Link>
                      </td>
                    </tr>
                  )

                })
              }
            </tbody>
          </table>
        </div>
        <div className="professors-home-page-count-container">
              <div className="professors-home-page-count"> 1 2 3 4 5</div>
        </div>
      </div>
    </div>
  )
}
