import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import DropdownMultiSelect from '../not-in-use/DropdownMultiSelect';
import exportFromJSON from 'export-from-json';
import PdfGeneratorProjects from '../PdfGeneratorProjects';
// import useProf from '../hooks/useProf';
import { useFilter } from '@react-aria/i18n';
import SearchHomeBar from '../SearchHomeBar';
import xlsimg from '../../images/xls.png';
import DropdownMultiSearch from '../DropdownMultiSearch';
import DropdownMultiSearchID from '../DropdownMultiSearchID';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function exportJson(data1) { // mozda napravi komponentu dugme XLS kliknes i odradi ovu funkciju
  data1.forEach(element => {
    delete element._id
    delete element.__v
  });
  const data = data1
  const fileName = 'projekti'
  const exportType = 'xls'
  exportFromJSON({ data, fileName, exportType })
}

export default function ProjectsHome() {
  const [professors, setProfessors, projects, setProjects] = useOutletContext();
  const [filtriraniProjekti, setFiltriraniProjekti] = useState(projects);
  const [query, setQuery] = useState('');
  const [opcijeVrstaProjekta, setOpcijeVrstaProjekta] = useState([]);
  const [opcijeNazivPrograma, setOpcijeNazivPrograma] = useState([]);
  const [opcijeKljucneReci, setOpcijeKljucneReci] = useState([]);
  const [opcijePlaniraniPocetak, setOpcijePlaniraniPocetak] = useState();
  const [opcijePlaniraniZavrsetak, setOpcijePlaniraniZavrsetak] = useState();
  // sort po vrstaProjekta(medjunarodni lokanlni itd.) sort po datum pocetka i zavrsetka i po programu i mozda po kljucnim recima

  let { contains } = useFilter({
    sensitivity: 'base'
  });

  useEffect(() => {
    const stariProjekti = [...projects];

    const filtriraniStariProjekti = stariProjekti.filter(project => {

      if (query) {
        if (false) {/* u ovom ifu gledas da li se query ne pojavljuje nigde, ako queryja nema nigde vracas false*/
          return false
        }
      }
      // u ovom ifu gledas dal je neki su svi filteri ne izabrani, ako nijedan filter nije izabran vracas profesora
      if ((opcijeVrstaProjekta.length == 0) && (opcijeNazivPrograma.length == 0) && (opcijeKljucneReci.length == 0) && (!opcijePlaniraniPocetak) && (!opcijePlaniraniZavrsetak)) {
        return true;
      }
      // u ovom ifu i sledecim ifovima gledas dal je filter stavljen, ako jeste primeni taj filter, ako nadjes profesora sa tim filterom vrati true
      if ((opcijeVrstaProjekta.length != 0) && opcijeVrstaProjekta.some(opcija => opcija == project.vrstaProjekta)) {
        return true;
      }
      if ((opcijeNazivPrograma.length != 0) && opcijeNazivPrograma.some(opcija => opcija == project.nazivPrograma)) {
        return true;
      }
      if ((opcijeKljucneReci.length != 0) && project.kljucneReci.some((el) => opcijeKljucneReci.includes(el))) {
        return true;
      }
      // if((opcijePlaniraniPocetak && opcijePlaniraniZavrsetak) && !((new Date(project.planiraniPocetak))>opcijePlaniraniPocetak && (new Date(project.planiraniZavrsetak))<opcijePlaniraniZavrsetak)){
      //   return false;
      // }
      console.log((new Date(project.planiraniPocetak)) > opcijePlaniraniPocetak)
      if (opcijePlaniraniPocetak && (new Date(project.planiraniPocetak)) > opcijePlaniraniPocetak) {
        return true;
      }
      if (opcijePlaniraniZavrsetak && (new Date(project.planiraniZavrsetak)) < opcijePlaniraniZavrsetak) {
        return true;
      }
      // ako profesor nije nadjen posle nijednog od ovih filtera nemoj da ga vracas
      return false;
    });

    setFiltriraniProjekti(filtriraniStariProjekti);
  }, [opcijeVrstaProjekta, opcijeNazivPrograma, opcijeKljucneReci, opcijePlaniraniPocetak, query, projects, opcijePlaniraniZavrsetak]); /* u ove zagrade stavljas query projekte, i nizove svih filtera */

  return (
    <div className="professors-home-container">
      <div className="professors-home-filters-container">
        <span className="professors-home-filters-title">Napredna pretraga</span>
        {/* dal cu search koristiti jos se pitam, vrv je nebitan za ovu aplikaciju, trenutno postoji vizuelno ali nije povezan na back, mogu eventualno da ga povezem na ime i prezime */}
        <div>
          <span className="professors-home-filters-span">Planirani pocetak</span>
          <div className="date-picker-container-projects-home">
            <ReactDatePicker
              placeholderText="Pocetni datum"
              dateFormat="dd/MM/yyyy"
              showIcon
              isClearable
              closeOnScroll={true}
              selected={opcijePlaniraniPocetak}
              onChange={(date) => setOpcijePlaniraniPocetak(date)}
              selectsStart
              startDate={opcijePlaniraniPocetak}
              endDate={opcijePlaniraniZavrsetak}
              maxDate={opcijePlaniraniZavrsetak}
              className='date-picker-component'
            />
          </div>
        </div>
        <div>
          <span className="professors-home-filters-span">Planirani zavrsetak</span>
          <div className="date-picker-container-projects-home">
            <ReactDatePicker
              placeholderText="Zavrsni datum"
              dateFormat="dd/MM/yyyy"
              showIcon
              isClearable
              selected={opcijePlaniraniZavrsetak}
              onChange={(date) => setOpcijePlaniraniZavrsetak(date)}
              selectsEnd
              startDate={opcijePlaniraniPocetak}
              endDate={opcijePlaniraniZavrsetak}
              minDate={opcijePlaniraniPocetak}
              className='date-picker-component'
            />
          </div>
        </div>
        <div>
          <span className="professors-home-filters-span">Naziv programa</span>
          <DropdownMultiSearch importArray={[...new Set(projects?.map(x => x.nazivPrograma).flat(1))]} uniqueSelectedItems={opcijeNazivPrograma} setUniqueSelectedItems={setOpcijeNazivPrograma} placeholder={"Izaberite program"} />
        </div>

        <div>
          <span className="professors-home-filters-span">Vrsta projekta</span>
          <DropdownMultiSearch importArray={["medjunarodni", "domaci", "interni"]} uniqueSelectedItems={opcijeVrstaProjekta} setUniqueSelectedItems={setOpcijeVrstaProjekta} placeholder={"Izaberite vrstu projekta"} />
        </div>

        <div>
          <span className="professors-home-filters-span">Kljucne reci</span>
          <DropdownMultiSearch importArray={[...new Set(projects?.map(x => x.kljucneReci).flat(1))]} uniqueSelectedItems={opcijeKljucneReci} setUniqueSelectedItems={setOpcijeKljucneReci} placeholder={"Izaberite kljucne reci"} />
        </div>

      </div>
      <div className="professors-home-content-container">
        <div className="professors-home-content-title-container">
          <span className="professors-home-content-title">Lista projekata</span>
        </div>
        <div className="professors-home-content-utils-container">
          <SearchHomeBar query={query} setQuery={setQuery} />
          <div className="professors-home-content-utils-buttons-container">
            <button className='professors-home-content-utils-buttons-res'>
              <span className='professors-home-content-utils-buttons-xls-span'>
                {filtriraniProjekti.length} Rezultat/a
              </span>

            </button>
            <button className='professors-home-content-utils-buttons-xls' onClick={() => exportJson(filtriraniProjekti)}>
              <img src={xlsimg} alt="" className='professors-home-content-utils-buttons-xls-img' />
              <span className='professors-home-content-utils-buttons-xls-span'>
                Eksportuj u XLS
              </span>

            </button>

            <PdfGeneratorProjects filtriraniProjekti={filtriraniProjekti} professors={professors} />
          </div>

        </div>
        <div className="professors-home-table-container">
          <table className='professors-home-table'>
            <thead className='professors-home-table-head'>
              <tr className='professors-home-table-head-row'>
                <th className='professors-home-table-head-cell'></th>
                <th className='professors-home-table-head-cell'>Program</th>
                <th className='professors-home-table-head-cell'>Naziv</th>
                <th className='professors-home-table-head-cell'>Vrsta</th>
                <th className='professors-home-table-head-cell'>Planirani Pocetak</th>
                <th className='professors-home-table-head-cell'>Planirani Zavrsetak</th>
                <th className='professors-home-table-head-cell'>Trajanje</th>

                <th className='professors-home-table-head-cell'></th>

              </tr>
            </thead>
            <tbody className='professors-home-table-body'>
              { // ovde rezultat
                filtriraniProjekti?.map(projekat => {
                  return (
                    <tr className='professors-home-table-body-row' key={projekat._id} >
                      <td className='professors-home-table-body-cell'>
                        <Link to={"/view/project/" + projekat._id}>
                          <button className='professors-home-table-body-edit-cell-button'>
                            <span className="material-symbols-outlined">
                              visibility
                            </span>

                          </button>
                        </Link>
                      </td>
                      <td className='professors-home-table-body-cell title-body-cell'>{projekat.nazivPrograma}</td>
                      <td className='professors-home-table-body-cell'>{projekat.nazivProjekta}</td>
                      <td className='professors-home-table-body-cell'>{projekat.vrstaProjekta}</td>
                      <td className='professors-home-table-body-cell'>{projekat.planiraniPocetak ? `${new Date(projekat.planiraniPocetak).getDate()}.${new Date(projekat.planiraniPocetak).getMonth() + 1}.${new Date(projekat.planiraniPocetak).getFullYear()}` : ""}</td>
                      <td className='professors-home-table-body-cell'>{projekat.planiraniZavrsetak ? `${new Date(projekat.planiraniZavrsetak).getDate()}.${new Date(projekat.planiraniZavrsetak).getMonth() + 1}.${new Date(projekat.planiraniZavrsetak).getFullYear()}` : ""}</td>
                      <td className='professors-home-table-body-cell'>{projekat.trajanje}</td>

                      <td className='professors-home-table-body-edit-cell'>
                        <Link to={"/projects/edit/" + projekat._id}>
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
