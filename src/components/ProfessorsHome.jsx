import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import DropdownMultiSelect from './DropdownMultiSelect';
import exportFromJSON from 'export-from-json';
import PdfGenerator from './PdfGenerator';
// import useProf from '../hooks/useProf';
import { useFilter } from '@react-aria/i18n';
import SearchHomeBar from './SearchHomeBar';
import xlsimg from '../images/xls.png';
import SortSpan from './SortSpan';
import DropdownMultiSearch from './DropdownMultiSearch';
import { katedreOptionsArray } from './data/katedre';
import { oblastiIstrazivanjaOptionsArray } from './data/oblastiIstrazivanja';
import DropdownMultiSearchID from './DropdownMultiSearchID';

function exportJson(data1) { // mozda napravi komponentu dugme XLS kliknes i odradi ovu funkciju
  data1.forEach(element => {
    delete element._id
    delete element.__v
  });
  const data = data1
  const fileName = 'profesori'
  const exportType = 'xls'
  exportFromJSON({ data, fileName, exportType })
}

export default function ProfessorsHome() {
  const [professors, setProfessors, projects, setProjects] = useOutletContext();
  // const {professors, setProfessors} = useProf();
  const [filtriraniProfesori, setFiltriraniProfesori] = useState(professors);
  const [query, setQuery] = useState('');
  const [opcijeOblastiIstrazivanja, setOpcijeOblastiIstrazivanja] = useState([]);
  const [opcijeKatedre, setOpcijeKatedre] = useState([]);
  const [opcijeProjekti, setOpcijeProjekti] = useState([]);
  const [opcijePublikacije, setOpcijePublikacije] = useState([]);
  const [opcijeTagovi, setOpcijeTagovi] = useState([]);

  // const [showSortModal, setShowSortModal] = useState(false);//moguci fix je da napravis komponentu BrojPublikacija
  function sortMax() {
    const stariProfesori = [...filtriraniProfesori];
    const noviProf = stariProfesori.sort((a, b) => {
      return b.publikacije.length - a.publikacije.length;
    });
    setFiltriraniProfesori(noviProf);

  }
  function sortMin() {
    const stariProfesori = [...filtriraniProfesori];
    const noviProf = stariProfesori.sort((a, b) => {
      return a.publikacije.length - b.publikacije.length;
    });
    setFiltriraniProfesori(noviProf);
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
      // u ovaj QUERY CES DODATI I SORTIRANJE PREMA KATEDRI I SORTIRANJE PREMA * I SORTIRANJE PREMA SVEMU 
      if (query) {
        let title_firstname_lastname = professor.titula + " " + professor.ime + " " + professor.prezime;
        if (!(contains(title_firstname_lastname.toLowerCase(), query.toLowerCase()) || contains(professor.titula.toLowerCase(), query.toLowerCase()) || 
        contains(professor.prezime.toLowerCase(), query.toLowerCase()) || contains(professor.ime.toLowerCase(), query.toLowerCase()) || 
        contains(query.toLowerCase(), professor.ime.toLowerCase()) || contains(query.toLowerCase(), professor.prezime.toLowerCase()) || 
        contains(query.toLowerCase(), professor.titula.toLowerCase()) ||
        professor.oblastiIstrazivanja.some( item => contains(item.toLowerCase(), query.toLowerCase()) || contains(query.toLowerCase(),item.toLowerCase())) ||
        professor.katedre.some( item => contains(item.toLowerCase(), query.toLowerCase()) || contains(query.toLowerCase(),item.toLowerCase())) ||
        professor.publikacije.some( item => contains(item.toLowerCase(), query.toLowerCase()) || contains(query.toLowerCase(),item.toLowerCase())) ||
        professor.projekti.some( item => contains(item.toLowerCase(), query.toLowerCase()) || contains(query.toLowerCase(),item.toLowerCase())) ||
        professor.tagovi.some( item => contains(item.toLowerCase(), query.toLowerCase()) || contains(query.toLowerCase(),item.toLowerCase()))
        )) {
          return false
        }
      }
      if ((opcijeOblastiIstrazivanja.length == 0) && (opcijeKatedre.length == 0) && (opcijeProjekti.length == 0) && (opcijePublikacije.length == 0) && (opcijeTagovi.length == 0)) {
        return true;
      }
      if ((opcijeOblastiIstrazivanja.length != 0) && professor.oblastiIstrazivanja.some((el) => opcijeOblastiIstrazivanja.includes(el))) {
        return true;
      }
      if ((opcijeKatedre.length != 0) && professor.katedre.some((el) => opcijeKatedre.includes(el))) {
        return true;
      }
      if ((opcijeProjekti.length != 0) && professor.projekti.some((profesorovaSifra) => opcijeProjekti.some((projekat) => projekat._id.includes(profesorovaSifra)))) {
        return true;
      }
      if ((opcijePublikacije.length != 0) && professor.publikacije.some((el) => opcijePublikacije.includes(el))) {
        return true;
      }
      if ((opcijeTagovi.length != 0) && professor.tagovi.some((el) => opcijeTagovi.includes(el))) {
        return true;
      }

      return false;
      // mislim da je trenutno na unija, ako hoces presek zameni svuda return true i return false i zameni uslov drugi stavi uzvicnik ispred professor
    });

    setFiltriraniProfesori(filtriraniStariProfesori);
  }, [opcijeOblastiIstrazivanja, opcijeKatedre, opcijeProjekti, opcijePublikacije, query, professors, opcijeTagovi]);

  const [katedre1, setKatedre1] = useState([]);
  
  return (
    <div className="professors-home-container">
      <div className="professors-home-filters-container">
        <span className="professors-home-filters-title">Napredna pretraga</span>
        {/* dal cu search koristiti jos se pitam, vrv je nebitan za ovu aplikaciju, trenutno postoji vizuelno ali nije povezan na back, mogu eventualno da ga povezem na ime i prezime */}
        <div>
          <span className="professors-home-filters-span">Oblasti istraživanjanja</span>
          <DropdownMultiSearch importArray={oblastiIstrazivanjaOptionsArray} uniqueSelectedItems={opcijeOblastiIstrazivanja} setUniqueSelectedItems={setOpcijeOblastiIstrazivanja} placeholder={"Izaberite oblasti"}/>
        </div>
        
        <div>
          <span className="professors-home-filters-span">Katedre</span>
          <DropdownMultiSearch importArray={katedreOptionsArray} uniqueSelectedItems={opcijeKatedre} setUniqueSelectedItems={setOpcijeKatedre} placeholder={"Izaberite katedre"}/>
        </div>
        <div>
          <span className="professors-home-filters-span">Projekti</span>
          <DropdownMultiSearchID importArray={projects} uniqueSelectedItems={opcijeProjekti} setUniqueSelectedItems={setOpcijeProjekti} placeholder={"Izaberite projekte"}/>
        </div>
        <div>
          <span className="professors-home-filters-span">Publikacije</span>
          <DropdownMultiSearch importArray={[...new Set(professors?.map(x => x.publikacije).flat(1))]} uniqueSelectedItems={opcijePublikacije} setUniqueSelectedItems={setOpcijePublikacije} placeholder={"Izaberite publikacije"}/>
        </div>
        <div>
          <span className="professors-home-filters-span">Tagovi</span>
          <DropdownMultiSearch importArray={[...new Set(professors?.map(x => x.tagovi).flat(1))]} uniqueSelectedItems={opcijeTagovi} setUniqueSelectedItems={setOpcijeTagovi} placeholder={"Izaberite tagove"}/>
        </div>

      </div>
      <div className="professors-home-content-container">
        <div className="professors-home-content-title-container">
          <span className="professors-home-content-title">Lista profesora</span>
        </div>
        <div className="professors-home-content-utils-container">
          <SearchHomeBar query={query} setQuery={setQuery} />
          <div className="professors-home-content-utils-buttons-container">
            <button className='professors-home-content-utils-buttons-xls' onClick={() => exportJson(filtriraniProfesori)}>
              <img src={xlsimg} alt="" className='professors-home-content-utils-buttons-xls-img' />
              <span className='professors-home-content-utils-buttons-xls-span'>
                Eksportuj u XLS
              </span>

            </button>
            <PdfGenerator filtriraniProfesori={filtriraniProfesori} projects={projects} />
          </div>

        </div>
        <div className="professors-home-table-container">
          <table className='professors-home-table'>
            <thead className='professors-home-table-head'>
              <tr className='professors-home-table-head-row'>
                <th className='professors-home-table-head-cell'>Titula</th>
                <th className='professors-home-table-head-cell'>Ime i Prezime</th>
                <th className='professors-home-table-head-cell'>Oblasti Istrazivanja</th>
                <th className='professors-home-table-head-cell'>Katedre</th>
                <th className='professors-home-table-head-cell'>Projekti</th>
                <th className='professors-home-table-head-cell'>Publikacije</th>
                <th className='professors-home-table-head-cell'>Tagovi</th>
                <SortSpan sortMax={sortMax} sortMin={sortMin} />
                <th className='professors-home-table-head-cell'></th>

              </tr>
            </thead>
            <tbody className='professors-home-table-body'>
              { // ovde rezultat
                filtriraniProfesori?.map(professor => {
                  return (
                    <tr className='professors-home-table-body-row' key={professor._id} >
                      <td className='professors-home-table-body-cell title-body-cell'>{professor.titula}</td>
                      <td className='professors-home-table-body-cell'>{professor.ime} {professor.prezime}</td>
                      <td className='professors-home-table-body-cell'>{professor.oblastiIstrazivanja[0]}</td>
                      <td className='professors-home-table-body-cell'>{professor.katedre[0]}</td>
                      <td className='professors-home-table-body-cell'>{projects.map(pro => {if(pro._id == professor.projekti[0]){return pro.nazivProjekta}})}</td>
                      <td className='professors-home-table-body-cell'>{professor.publikacije[0]}</td>
                      <td className='professors-home-table-body-cell'><span className='tag-body-cell-span'>{professor.tagovi[0]}</span></td>
                      <td className='professors-home-table-body-cell'>{professor.publikacije.length} </td>
                      <td className='professors-home-table-body-edit-cell'>
                        <Link to={"/professors/edit/" + professor._id}>
                          <button className='professors-home-table-body-edit-cell-button'>
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                            <span className='professors-home-table-body-edit-cell-button-span'>
                              Izmeni
                            </span>
                          </button>
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
          <div className="professors-home-page-count">
              
          </div>
        </div>
      </div>
    </div>
  )
}
