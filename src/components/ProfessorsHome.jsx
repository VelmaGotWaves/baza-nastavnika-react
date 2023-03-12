import React, { useState, useEffect, useRef } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import SearchProfessorsBar from './SearchProfessorsBar';
import DropdownMultiSelect from './DropdownMultiSelect';
import exportFromJSON from 'export-from-json'
import PdfGenerator from './PdfGenerator';
import SortModal from './SortModal'
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
  const [filtriraniProfesori, setFiltriraniProfesori] = useState(professors);
  const [query, setQuery] = useState('');
  const [opcijeScientificResearch, setOpcijeScientificResearch] = useState([]);
  const [opcijeLabaratories, setOpcijeLabaratories] = useState([]);
  const [opcijeScientificProjects, setOpcijeScientificProjects] = useState([]);
  const [opcijeSignificantPublications, setOpcijeSignificantPublications] = useState([]);

  const [showSortModal, setShowSortModal] = useState(false);
  function sortMax() {
    setShowSortModal(false);
    filtriraniProfesori.sort((a, b) => {
      return b.significantPublications.length-a.significantPublications.length;
    });
  }
  function sortMin() {
    setShowSortModal(false);
    filtriraniProfesori.sort((a, b) => {
      return a.significantPublications.length - b.significantPublications.length;
    });
  }
  useEffect(() => {
    setFiltriraniProfesori(professors);
  }, [professors]);

  useEffect(() => {
    const stariProfesori = [...professors];

    const filtriraniStariProfesori = stariProfesori.filter(professor => {
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
      if ((opcijeScientificResearch.length == 0) && (opcijeLabaratories.length == 0) && (opcijeScientificProjects.length == 0) && (opcijeSignificantPublications.length == 0)) {
        return true;
      }
      return false;
      // mislim da je trenutno na unija, ako hoces presek zameni svuda return true i return false i zameni uslov drugi stavi uzvicnik ispred professor
    });

    setFiltriraniProfesori(filtriraniStariProfesori);
  }, [opcijeScientificResearch, opcijeLabaratories, opcijeScientificProjects, opcijeSignificantPublications]);


  return (
    <div className="professorsHome">
      <div className="searchFlexContainer">
        {/* dal cu search koristiti jos se pitam, vrv je nebitan za ovu aplikaciju, trenutno postoji vizuelno ali nije povezan na back, mogu eventualno da ga povezem na ime i prezime */}
        <SearchProfessorsBar query={query} setQuery={setQuery} />
        <DropdownMultiSelect uniqueSelectedItems={opcijeScientificResearch} setUniqueSelectedItems={setOpcijeScientificResearch} placeholder={"Naucno Istrazivanje"} nizOpcija={professors?.map(x => x.scientificResearch)} />
        <DropdownMultiSelect uniqueSelectedItems={opcijeLabaratories} setUniqueSelectedItems={setOpcijeLabaratories} placeholder={"Labaratorije"} nizOpcija={professors?.map(x => x.labaratories)} />
        <DropdownMultiSelect uniqueSelectedItems={opcijeScientificProjects} setUniqueSelectedItems={setOpcijeScientificProjects} placeholder={"Naucni Projekti"} nizOpcija={professors?.map(x => x.scientificProjects)} />
        <DropdownMultiSelect uniqueSelectedItems={opcijeSignificantPublications} setUniqueSelectedItems={setOpcijeSignificantPublications} placeholder={"Najznacajnije Publikacije"} nizOpcija={professors?.map(x => x.significantPublications)} />

        <button className='xlsResultBtn' onClick={() => exportJson(filtriraniProfesori)}>Eksportuj u XLS</button>
        <PdfGenerator filtriraniProfesori={filtriraniProfesori} />
      </div>
      <div className="resultsFlexContainer">
        <div className="professorsStatisticsContainer">

        </div>
        <div className="professorsResultContainer">
          <table className='resultsTable'>
            <thead>
              <tr >
                <th>Ime</th>
                <th>Naucno Istrazivanje(Kategorije)</th>
                <th>Labaratorije</th>
                <th>Naucni Projekti</th>
                <th>Najznacajnije Publikacije</th>
                <th onClick={() => setShowSortModal(() => !showSortModal)}>
                  Broj Publikacija
                  <span className="material-symbols-outlined">
                    sort
                  </span>
                  {showSortModal && <SortModal sortMin={sortMin} sortMax={sortMax} />}
                </th>
                <th>Izmeni</th>
              </tr>
            </thead>
            <tbody>
              { // ovde rezultat
                filtriraniProfesori?.map(professor => {

                  return (
                    <tr key={professor._id} >
                      <td >{professor.title} {professor.firstname} {professor.lastname}</td>
                      <td >{professor.scientificResearch[0]}</td>
                      <td >{professor.labaratories[0]}</td>
                      <td >{professor.scientificProjects[0]}</td>
                      <td >{professor.significantPublications[0]}</td>
                      <td>{professor.significantPublications.length} </td>
                      <td><Link to={"/professors/edit/" + professor._id}><button>Izmeni</button></Link></td>
                    </tr>
                  )

                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
