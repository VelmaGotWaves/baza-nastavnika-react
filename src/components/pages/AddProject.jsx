import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SuccessModuo from '../SuccessModuo';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchSpecificProfessorsBar from '../SearchSpecificProfessorsBar';
import SearchMultipleProfessorsBar from '../SearchMultipleProfessorsBar';
const PROJECT_REGEX = /^[a-zA-Z0-9].*/;
const VRSTA_PROJEKTA_REGEX = /\b(domaci|medjunarodni|interni)\b/;


export default function AddProject() {
  const [professors, setProfessors, projects, setProjects] = useOutletContext();
  const axiosPrivate = useAxiosPrivate();

  const [vrstaProjekta, setVrstaProjekta] = useState('');
  const [validVrstaProjekta, setValidVrstaProjekta] = useState(false);

  const [programFinansiranja, setProgramFinansiranja] = useState('');

  const [nazivProjekta, setNazivProjekta] = useState('');
  const [validNazivProjekta, setValidNazivProjekta] = useState(false);

  const [nazivPrograma, setNazivPrograma] = useState('');

  const [referentniBroj, setReferentniBroj] = useState('');

  const [interniBroj, setInterniBroj] = useState('');

  const [rukovodilac, setRukovodilac] = useState();

  const [administrator, setAdministrator] = useState();

  const [profitniCentar, setProfitniCentar] = useState('');

  const [planiraniPocetak, setPlaniraniPocetak] = useState(new Date());
  const [planiraniZavrsetak, setPlaniraniZavrsetak] = useState(null);

  const [trajanje, setTrajanje] = useState('');
  const [ukupanBudzet, setUkupanBudzet] = useState('');
  const [budzetZaFon, setBudzetZaFon] = useState('');
  const [opis, setOpis] = useState('');
  const [ciljevi, setCiljevi] = useState('');

  const [partnerskeInstitucije, setPartnerskeInstitucije] = useState({
    koordinator: '',
    partneri: []
  });
  const [partneriText, setPartneriText] = useState('');
  // ovog momka ces morati da pretvoris u niz , samo copy paste sa edit profs ili nes tako

  const [clanoviProjektnogTima, setClanoviProjektnogTima] = useState([]);

  const [website, setWebsite] = useState('');
  const [kljucneReci, setKljucneReci] = useState('');

  const [fileUgovor, setFileUgovor] = useState();
  // const [fileUgovorIme, setFileUgovorIme] = useState([]);
  const [filesAneksi, setFilesAneksi] = useState([]);
  // const [filesAneksiImena, setFilesAneksiImena] = useState([]);


  const [errMsg, setErrMsg] = useState('');
  // const [success, setSuccess] = useState(false);
  const [viewSuccessModuo, setViewSuccessModuo] = useState(false)

  useEffect(() => {
    setValidNazivProjekta(PROJECT_REGEX.test(nazivProjekta));
  }, [nazivProjekta])
  useEffect(() => {
    setValidVrstaProjekta(['medjunarodni', 'domaci', 'interni'].includes(vrstaProjekta));
  }, [vrstaProjekta])


  useEffect(() => {
    setErrMsg('');
  }, [nazivProjekta, nazivPrograma, vrstaProjekta])


  const allowedFileExtensions = ["png", "jpeg", "txt", "pdf", "doc", "docx", "rtf", "xls"];
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ovde ce biti provera uslova TODO MISLIM DA IMA JOS DOSTA OVDE DA SE VALIDIRA ALI KO CE GA ZNATI (npr date, npr sa png na pdf, npr itd....)


    if (!PROJECT_REGEX.test(nazivProjekta)) {
      setErrMsg("Nije dobar naziv projekta");
      return;
    }
    if (!['medjunarodni', 'domaci', 'interni'].includes(vrstaProjekta)) {
      setErrMsg("Nije dobra vrsta projekta");
      return;
    }
    const kljucneReciArray = kljucneReci.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
    const kljucneReciArrayWithoutEmptyStrings = kljucneReciArray.filter((str) => {
      if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
        return true
      }
    });
    const kljucneReciFINAL = kljucneReciArrayWithoutEmptyStrings.map((str) => str.trim());

    setPartnerskeInstitucije(prev => {
      const partneriArray = partneriText.replace(/[\t\n]|[^\S\n\r ]+/g, ' ').split("!");
      const partneriArrayWithoutEmptyStrings = partneriArray.filter((str) => {
        if (str?.trim() != "" && str?.trim() !== "" && str?.trim() != null && str?.trim() != "null") {
          return true
        }
      });
      const partneriFINAL = partneriArrayWithoutEmptyStrings.map((str) => str.trim());
      return {
        koordinator: prev.koordinator,
        partneri: [...partneriFINAL]
      }
    })
    console.log(partnerskeInstitucije)

    const fd = new FormData();

    if (typeof fileUgovor === "object") {
      if (!allowedFileExtensions.some((extension) => extension == fileUgovor.name.split('.').pop().toLowerCase())) {
        setErrMsg("Fajl ugovora nije dozvoljenog tipa");
        return;
      }
      if(fileUgovor.size > 5*1024*1024){// 5 MB
        setErrMsg("Fajl ugovora je veci od 5 MB");
        return;
      } 
      fd.append("fileUgovor", fileUgovor);

    }
    if (typeof filesAneksi === "object") {
      if (Object.keys(filesAneksi).map(key => filesAneksi[key].name).find(fileName => !allowedFileExtensions.some((extension) => extension == fileName.split('.').pop().toLowerCase()))) {

        setErrMsg("Fajl aneksa nije dozvoljenog tipa");
        return;
      }
      if(Object.keys(filesAneksi).some(key => filesAneksi[key].size > 5*1024*1024)){// 5 MB
        setErrMsg("Neki aneks je veci od 5 MB");
        return;
      } 
      Object.keys(filesAneksi).forEach(key => {
        fd.append("filesAneksi", filesAneksi[key])
      });
    }
    // ostojathegamer
    fd.append("nazivProjekta", nazivProjekta);


    fd.append("nazivPrograma", nazivPrograma);
    fd.append("vrstaProjekta", vrstaProjekta);
    fd.append("programFinansiranja", programFinansiranja);
    fd.append("referentniBroj", referentniBroj);
    fd.append("interniBroj", interniBroj);
    fd.append("rukovodilac", rukovodilac);
    fd.append("administrator", administrator);
    fd.append("profitniCentar", profitniCentar);
    fd.append("planiraniPocetak", planiraniPocetak);
    fd.append("planiraniZavrsetak", planiraniZavrsetak);
    fd.append("trajanje", trajanje);
    fd.append("ukupanBudzet", ukupanBudzet);
    fd.append("budzetZaFon", budzetZaFon);
    fd.append("opis", opis);
    fd.append("ciljevi", ciljevi);
    fd.append("partnerskeInstitucije", JSON.stringify(partnerskeInstitucije));
    fd.append("clanoviProjektnogTima", JSON.stringify(clanoviProjektnogTima));
    fd.append("website", website);
    fd.append("kljucneReci", JSON.stringify(kljucneReciFINAL));


    try {
      setErrMsg('');
      const response = await axiosPrivate.post("/projects", fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // withCredentials: true mora bez with credentials da bi se poslala slika, kako radi ne znam, posto inace treba credentials da bi se poslao authorization header
      }
      );

      setViewSuccessModuo(true);
      setProjects(() => {
        const projWithoutTheOne = projects.filter(proj => proj._id != response.data._id)
        return [
          ...projWithoutTheOne,
          response.data]
      })

      // TODO resetuj sve na default values
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Project name is required');
      } else {
        setErrMsg('Registration Failed')
      }
    }

  }



  return (
    <>


      <div className='add-professor-page-container'>
        <div className="add-professor-form-container">


          <form className="add-professor-form" onSubmit={handleSubmit}>
            <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
            <span className="add-professor-form-title">Dodaj novi projekat</span>
            <hr className="add-professor-form-seperator" />
            <div className="add-professor-form-inputs-container">
              <div className="add-professor-form-name-inputs-container">
                <div className="add-professor-form-name-inputs-left">
                  <label htmlFor="nprojekta" className='add-professor-form-label'>
                    Naziv Projekta:
                  </label>
                  <input
                    type="text"
                    id="nprojekta"
                    autoComplete="off"
                    onChange={(e) => setNazivProjekta(e.target.value)}
                    value={nazivProjekta}
                    required
                    className='add-professor-form-name-input'
                    placeholder='Unesite naziv projekta'
                  />
                  <span className='add-professor-form-name-input-description'>
                    Neophodno.
                  </span>

                </div>
                <div className="add-professor-form-name-inputs-right">

                  <label htmlFor="nprograma" className='add-professor-form-label'>
                    Naziv programa:
                  </label>
                  <input
                    type="text"
                    id="nprograma"
                    onChange={(e) => setNazivPrograma(e.target.value)}
                    value={nazivPrograma}
                    className='add-professor-form-name-input'
                    placeholder='Unesite naziv programa'

                  />
                  <span className='add-professor-form-name-input-description'>
                    Nije neophodo.
                  </span>

                </div>
              </div>

              <div className="add-professor-form-information-inputs-container">

                <label htmlFor="vrstaProjekta" className="add-professor-form-label">
                  Vrsta Projekta
                </label>
                <select
                  id="vrstaProjekta"
                  onChange={(e) => { setVrstaProjekta(e.target.value) }}
                  value={vrstaProjekta}
                  className='projects-select-component'
                >
                  <option value="" className='projects-select-option'>Izaberite</option>
                  <option value="domaci" className='projects-select-option'>Domaći</option>
                  <option value="medjunarodni" className='projects-select-option'>Međunarodni</option>
                  <option value="interni" className='projects-select-option'>Interni</option>
                </select>

                <label htmlFor="programFinansiranja" className="add-professor-form-label">
                  Program finansiranja (naručilac projekta)
                </label>
                <input
                  type="text"
                  id="programFinansiranja"
                  onChange={(e) => setProgramFinansiranja(e.target.value)}
                  value={programFinansiranja}
                  className='add-professor-form-name-input'
                  placeholder='Unesite program finansiranja'
                />
                <span className='add-professor-form-name-input-description'>
                  Mora
                </span>


              </div>
              <div className="add-professor-form-name-inputs-container">
                <div className="add-professor-form-name-inputs-left">
                  <label htmlFor="referentniBroj" className="add-professor-form-label">
                    Referentni broj
                  </label>
                  <input
                    type="text"
                    id="referentniBroj"
                    autoComplete="off"
                    onChange={(e) => setReferentniBroj(e.target.value)}
                    value={referentniBroj}
                    className='add-professor-form-name-input'
                    placeholder='Unesite referentni broj'
                  />
                  <span className='add-professor-form-name-input-description'>
                    Neophodno.
                  </span>
                </div>
                <div className="add-professor-form-name-inputs-right">
                  <label htmlFor="interniBroj" className="add-professor-form-label">
                    Interni broj
                  </label>
                  <input
                    type="text"
                    id="interniBroj"
                    autoComplete="off"
                    onChange={(e) => setInterniBroj(e.target.value)}
                    value={interniBroj}
                    className='add-professor-form-name-input'
                    placeholder='Unesite interni broj'
                  />
                  <span className='add-professor-form-name-input-description'>
                    Neophodno.
                  </span>
                </div>
              </div>
              <div className="add-professor-form-information-inputs-container">

                <label className="add-professor-form-label">
                  Rukovodilac
                </label>
                <SearchSpecificProfessorsBar professors={professors} professorId={administrator} setProfessorId={setRukovodilac} />
                {rukovodilac ? (
                  <span className='add-professor-form-name-input-description' style={{ color: "#47C9A2" }}>
                    {
                      professors.map(prof => {
                        if (prof._id == rukovodilac) return (`${prof.titula} ${prof.ime} ${prof.prezime}`)
                        else (`Rukovodilac nije izabran.`)
                      })
                    }
                  </span>
                ) : (
                  <span className='add-professor-form-name-input-description'>
                    Rukovodilac nije izabran.
                  </span>
                )}


                <label className="add-professor-form-label">
                  Administrator
                </label>
                <SearchSpecificProfessorsBar professors={professors} professorId={administrator} setProfessorId={setAdministrator} />
                {administrator ? (
                  <span className='add-professor-form-name-input-description' style={{ color: "#47C9A2" }}>
                    {
                      professors.map(prof => {
                        if (prof._id == administrator) return (`${prof.titula} ${prof.ime} ${prof.prezime}`)
                        else (`Administrator nije izabran.`)
                      })
                    }
                  </span>
                ) : (
                  <span className='add-professor-form-name-input-description'>
                    Administrator nije izabran.
                  </span>
                )}




                <label htmlFor="profitniCentar" className="add-professor-form-label">
                  Profitni centar
                </label>
                <input
                  type="text"
                  id="profitniCentar"
                  onChange={(e) => setProfitniCentar(e.target.value)}
                  value={profitniCentar}
                  className='add-professor-form-name-input'
                  placeholder='Unesite profitni centar'
                />
                <span className='add-professor-form-name-input-description'>
                  Mora
                </span>
              </div>
              <div className="add-professor-form-name-inputs-container">
                <div className="add-professor-form-name-inputs-left">
                  <label htmlFor="" className="add-professor-form-label">
                    Planirani početak
                  </label>
                  <div className="date-picker-container">
                    <ReactDatePicker
                      placeholderText="Pocetni datum"
                      dateFormat="dd/MM/yyyy"
                      showIcon
                      isClearable
                      closeOnScroll={true}
                      selected={planiraniPocetak}
                      onChange={(date) => setPlaniraniPocetak(date)}
                      selectsStart
                      startDate={planiraniPocetak}
                      endDate={planiraniZavrsetak}
                      maxDate={planiraniZavrsetak}
                      className='date-picker-component'
                    />
                  </div>
                </div>
                <div className="add-professor-form-name-inputs-right">

                  <label htmlFor="" className="add-professor-form-label">
                    Planirani završetak
                  </label>
                  <div className="date-picker-container">
                    <ReactDatePicker
                      placeholderText="Zavrsni datum"
                      dateFormat="dd/MM/yyyy"
                      showIcon
                      isClearable
                      selected={planiraniZavrsetak}
                      onChange={(date) => setPlaniraniZavrsetak(date)}
                      selectsEnd
                      startDate={planiraniPocetak}
                      endDate={planiraniZavrsetak}
                      minDate={planiraniPocetak}
                      className='date-picker-component'
                    />
                  </div>
                </div>
              </div>

              <div className="add-professor-form-information-inputs-container">


                <label htmlFor="trajanje" className="add-professor-form-label">
                  Trajanje
                </label>
                <input
                  type="text"
                  id="trajanje"
                  onChange={(e) => setTrajanje(e.target.value)}
                  value={trajanje}
                  className='add-professor-form-name-input'
                  placeholder='Unesite trajanje'
                />
                <span className='add-professor-form-name-input-description'>
                  ne Mora bas sve
                </span>

              </div>
              <div className="add-professor-form-name-inputs-container">
                <div className="add-professor-form-name-inputs-left">
                  <label htmlFor="ukupanBudzet" className="add-professor-form-label">
                    Ukupan budžet
                  </label>
                  <input
                    type="text"
                    id="ukupanBudzet"
                    autoComplete="off"
                    onChange={(e) => setUkupanBudzet(e.target.value)}
                    value={ukupanBudzet}
                    className='add-professor-form-name-input'
                    placeholder='Unesite ukupan budzet'
                  />
                  <span className='add-professor-form-name-input-description'>
                    Neophodno.
                  </span>
                </div>
                <div className="add-professor-form-name-inputs-right">
                  <label htmlFor="budzetZaFon" className="add-professor-form-label">
                    Budžet za FON
                  </label>
                  <input
                    type="text"
                    id="budzetZaFon"
                    autoComplete="off"
                    onChange={(e) => setBudzetZaFon(e.target.value)}
                    value={budzetZaFon}
                    className='add-professor-form-name-input'
                    placeholder='Unesite budzet za FON'
                  />
                  <span className='add-professor-form-name-input-description'>
                    Neophodno.
                  </span>
                </div>
              </div>
              <div className="add-professor-form-information-inputs-container">

                <label htmlFor="opis" className="add-professor-form-label">
                  Opis
                </label>
                <span className='add-professor-form-information-input-description'>
                  Potrebno je uneti opis
                </span>
                <textarea
                  className='add-professor-form-information-input'
                  id="opis"
                  onChange={(e) => setOpis(e.target.value)}
                  value={opis}
                  placeholder='Unesite opis'
                />

                <label htmlFor="ciljevi" className="add-professor-form-label">
                  Ciljevi
                </label>
                <span className='add-professor-form-information-input-description'>
                  Potrebno je uneti ciljeve
                </span>
                <textarea
                  className='add-professor-form-information-input'
                  id="ciljevi"
                  onChange={(e) => setCiljevi(e.target.value)}
                  value={ciljevi}
                  placeholder='Unesite ciljeve'
                />

                <label htmlFor="koordinator" className="add-professor-form-label">
                  Partnerske institucije: Koordinator
                </label>
                <span className='add-professor-form-information-input-description'>
                  Potrebno je uneti koordinatora
                </span>
                <textarea
                  className='add-professor-form-information-input'

                  id="koordinator"
                  onChange={(e) => setPartnerskeInstitucije((prev) => {
                    return {
                      koordinator: e.target.value,
                      partneri: [...prev.partneri]
                    }
                  })}
                  value={partnerskeInstitucije.koordinator}
                  placeholder='Unesite koordinatora'
                />


                <label htmlFor="partneri" className="add-professor-form-label">
                  Partnerske institucije: Partneri
                </label>
                <span className='add-professor-form-information-input-description'>
                  Potrebno je uneti partnere.<br />Svakog partnera je potrebno razdvojiti <b>uzvičnikom!</b>
                </span>
                <textarea
                  className='add-professor-form-information-input'

                  id="partneri"
                  onChange={(e) => setPartneriText(e.target.value)}
                  value={partneriText}
                  placeholder='Unesite partnere'
                />


                <label htmlFor="" className="add-professor-form-label">
                  Članovi projektnog tima
                </label>
                <SearchMultipleProfessorsBar professors={professors} professorIds={clanoviProjektnogTima} setProfessorIds={setClanoviProjektnogTima} />

                <label htmlFor="website" className="add-professor-form-label">
                  Web-sajt
                </label>
                <input
                  type="text"
                  id="website"
                  autoComplete="off"
                  onChange={(e) => setWebsite(e.target.value)}
                  value={website}
                  className='add-professor-form-name-input'
                  placeholder='Unesite website'
                />

                <label htmlFor="kljucneReci" className="add-professor-form-label">
                  Ključne reči
                </label>
                <span className='add-professor-form-information-input-description'>
                  Potrebno je uneti kljucne reci.<br />Svaku kljucnu rec razdvojiti <b>uzvičnikom!</b>
                </span>
                <textarea
                  className='add-professor-form-information-input'

                  id="kljucneReci"
                  onChange={(e) => setKljucneReci(e.target.value)}
                  value={kljucneReci}
                  placeholder='Unesite kljucneReci'
                />

              </div>

              <div className="add-professor-form-name-inputs-container">
                <div className="add-professor-form-name-inputs-left">
                  <label className="add-professor-form-label">
                    Ugovor
                  </label>
                  <input type="file" name="" id="" onChange={(e) => { setFileUgovor(e.target.files[0]) }} accept=".png,.jpeg,.txt,.pdf,.doc,.docx,.rtf,.xls" />
                  {/* na kraju dodaj neku logiku za pakovanje ovih fajlova */}
                  <span className='add-professor-form-information-input-description'>
                    Dozvoljen je fajl tipa: .png, .jpeg, .txt, .pdf, .doc, .docx, .rtf, .xls <br />
                    Jedan fajl ne sme da predje 5MB
                  </span>

                </div>
                <div className="add-professor-form-name-inputs-right">
                  <label className="add-professor-form-label">
                    Aneksi
                  </label>
                  <input type="file" name="" id="" multiple onChange={(e) => { setFilesAneksi(e.target.files) }} accept=".png,.jpeg,.txt,.pdf,.doc,.docx,.rtf,.xls" />
                  <span className='add-professor-form-information-input-description'>
                    Dozvoljeni su fajlovi tipa: .png, .jpeg, .txt, .pdf, .doc, .docx, .rtf, .xls <br />
                    Jedan fajl ne sme da predje 5MB
                  </span>
                </div>
              </div>
            </div>
            <hr className="add-professor-form-seperator" />

            <button type="submit" disabled={!validNazivProjekta || !validVrstaProjekta ? true : false} className="add-professor-form-button-submit">Dodaj projekat</button>

          </form>
        </div>
      </div>
      {viewSuccessModuo &&
        <SuccessModuo placeholder="dodali projekat u nasu bazu" setViewSuccessModuo={setViewSuccessModuo} />
      }
    </>
  )
}
