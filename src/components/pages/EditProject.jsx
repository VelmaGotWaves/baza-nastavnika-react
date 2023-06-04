import React, { useState, useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SuccessModuo from '../SuccessModuo';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchSpecificProfessorsBar from '../SearchSpecificProfessorsBar';
import SearchMultipleProfessorsBar from '../SearchMultipleProfessorsBar';
import SearchSpecificProjectBar from '../SearchSpecificProjectBar';
import DeleteModuo from '../DeleteModuo';

const PROJECT_REGEX = /^[a-zA-Z0-9].*/;
const VRSTA_PROJEKTA_REGEX = /\b(domaci|medjunarodni|interni)\b/;

export default function EditProject() {
  const { id } = useParams();
  const [firstFire, setFirstFire] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [foundProject, setFoundProject] = useState();

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

  const [planiraniPocetak, setPlaniraniPocetak] = useState(null);
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


  const [ugovorAction, setUgovorAction] = useState()
  const [selectedUgovor, setSelectedUgovor] = useState()
  const [fileUgovor, setFileUgovor] = useState();

  const [aneksiAction, setAneksiAction] = useState()
  const [allAneksi, setAllAneksi] = useState([])
  const [selectedAneks, setSelectedAneks] = useState()
  const [filesAneksi, setFilesAneksi] = useState([])


  const [errMsg, setErrMsg] = useState('');
  // const [success, setSuccess] = useState(false);
  const [viewSuccessModuo, setViewSuccessModuo] = useState(false)
  const [viewDeleteModuo, setViewDeleteModuo] = useState(false)

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
  // handle submit, onda handle editovanje fajlova, onda handle delete
  async function handleDelete() {
    setErrMsg("");
    setViewSuccessModuo(false);
    setViewDeleteModuo(false)
    if (selectedId == "" || selectedId.length != 24) {
      setErrMsg("Id nije u dobrom formatu.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (!foundProject) {
      setErrMsg("Nije izabran projekat.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    try {
      const response = await axiosPrivate.delete('/projects',
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
          data: {
            id: selectedId
          }
        });
      setViewSuccessModuo(true);
      // TODO setovo sam projekte, ali sta je sa profesorima koji su takodje bili updejtovani, i njih moram da updejtume u frontendu.. ili da dodam refetch... definitivno moram da se promenim na useContext umesto useOutletContext
      setProjects(() => {
        const projectsWithoutTheOne = projects.filter(user => user._id != response.data._id)
        return [
          ...projectsWithoutTheOne
        ]
      })
      setVrstaProjekta('');
      setProgramFinansiranja('');
      setNazivPrograma('');
      setNazivProjekta('');
      setReferentniBroj('');
      setInterniBroj('');
      setRukovodilac();
      setAdministrator();
      setProfitniCentar('');
      setPlaniraniPocetak(null);
      setPlaniraniZavrsetak(null);
      setTrajanje('');
      setUkupanBudzet('');
      setBudzetZaFon('');
      setOpis('');
      setCiljevi('');
      setPartnerskeInstitucije({
        koordinator: '',
        partneri: []
      });
      setPartneriText('');
      setClanoviProjektnogTima([])
      setWebsite('');
      setKljucneReci('');

      setSelectedId('')
      setFoundProject();

      setUgovorAction()
      setSelectedUgovor()
      setFileUgovor();
      setAneksiAction()
      setAllAneksi([])
      setSelectedAneks()
      setFilesAneksi([])

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Id projekta nije u dobrom formatu.');
      } else if (err.response?.status === 404) {
        setErrMsg('Ne postoji projekat sa tim Id.');
      } else {
        setErrMsg('Failed to delete the user');
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedId == "" || selectedId.length != 24) {
      setErrMsg("Id nije u dobrom formatu.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (!foundProject) {
      setErrMsg("Nije izabran projekat.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    if (!PROJECT_REGEX.test(nazivProjekta)) {
      setErrMsg("Nije dobar naziv projekta.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (!['medjunarodni', 'domaci', 'interni'].includes(vrstaProjekta)) {
      setErrMsg("Nije dobra vrsta projekta.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
      console.log(partneriFINAL)
      console.log(prev)
      return {
        koordinator: prev.koordinator,
        partneri: partneriFINAL
      }
    })
    try {
      const response = await axiosPrivate.patch("/projects", {
        id: selectedId,
        nazivProjekta: nazivProjekta,
        nazivPrograma: nazivPrograma,
        vrstaProjekta: vrstaProjekta,
        programFinansiranja: programFinansiranja,
        referentniBroj: referentniBroj,
        interniBroj: interniBroj,
        rukovodilac: rukovodilac,
        administrator: administrator,
        profitniCentar: profitniCentar,
        planiraniPocetak: planiraniPocetak,
        planiraniZavrsetak: planiraniZavrsetak,
        trajanje: trajanje,
        ukupanBudzet: ukupanBudzet,
        budzetZaFon: budzetZaFon,
        opis: opis,
        ciljevi: ciljevi,
        partnerskeInstitucije: partnerskeInstitucije,
        clanoviProjektnogTima: clanoviProjektnogTima,
        website: website,
        kljucneReci: kljucneReciFINAL
      },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,

        }
      );
      setViewSuccessModuo(true);
      setProjects(() => {
        const projWithoutTheOne = projects.filter(proj => proj._id != response.data._id)
        return [
          ...projWithoutTheOne,
          response.data]
      })
      // TODO ako su promenjeni profesori promeni profesore *cimanje*
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Id/Naziv/Vrsta projekta nisu u dobrom formatu.');
      } else if (err.response?.status === 404) {
        setErrMsg('Ne postoji projekat sa tim Id.');
      } else {
        setErrMsg('Akcija nije uspela');
      }
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

  }

  function selectedProjectChanged(value, isSelectedIdSendingMe) {
    setViewSuccessModuo(false);
    setErrMsg("");

    const selectedProject = projects.find(proj => proj._id == value);
    if (selectedProject) {

      if (!isSelectedIdSendingMe) {
        setSelectedId(value)
      }
      setFoundProject(selectedProject)
      setVrstaProjekta(selectedProject.vrstaProjekta)
      setProgramFinansiranja(selectedProject.programFinansiranja)
      setNazivProjekta(selectedProject.nazivProjekta)
      setNazivPrograma(selectedProject.nazivPrograma)
      setReferentniBroj(selectedProject.referentniBroj)
      setInterniBroj(selectedProject.interniBroj)
      setRukovodilac(selectedProject.rukovodilac)
      setAdministrator(selectedProject.administrator)
      setProfitniCentar(selectedProject.profitniCentar)
      if (selectedProject.planiraniPocetak) {
        try {
          const myDate = new Date(selectedProject.planiraniPocetak)
          if (isNaN(myDate.getTime())) {
            throw new Error('Invalid date planiraniPocetak');
          }
          setPlaniraniPocetak(myDate)
        } catch (error) {
          console.log('Invalid date planiraniPocetak');
        }

      }
      if (selectedProject.planiraniZavrsetak) {
        try {
          const myDate = new Date(selectedProject.planiraniZavrsetak)
          if (isNaN(myDate.getTime())) {
            throw new Error('Invalid date planiraniPocetak');
          }
          setPlaniraniZavrsetak(myDate)
        } catch (error) {
          console.log('Invalid date planiraniPocetak');
        }

      }

      setProfitniCentar(selectedProject.profitniCentar)
      setTrajanje(selectedProject.trajanje)
      setUkupanBudzet(selectedProject.ukupanBudzet)
      setBudzetZaFon(selectedProject.budzetZaFon)
      setOpis(selectedProject.opis)
      setCiljevi(selectedProject.ciljevi)
      setPartnerskeInstitucije(selectedProject.partnerskeInstitucije)
      let tempPT = "";
      selectedProject.partnerskeInstitucije.partneri.map(partner => tempPT += partner + "!\n");
      setPartneriText(tempPT)
      setClanoviProjektnogTima(selectedProject.clanoviProjektnogTima)
      setWebsite(selectedProject.website)
      let tempKR = "";
      selectedProject.kljucneReci.map(kr => tempKR += kr + "!\n");
      setKljucneReci(tempKR)
      setSelectedUgovor(selectedProject.ugovor);
      setAllAneksi(selectedProject.aneksi);


      setFirstFire(false);


    } else {
      setVrstaProjekta('');
      setProgramFinansiranja('');
      setNazivPrograma('');
      setNazivProjekta('');
      setReferentniBroj('');
      setInterniBroj('');
      setRukovodilac();
      setAdministrator();
      setProfitniCentar('');
      setPlaniraniPocetak(null);
      setPlaniraniZavrsetak(null);
      setTrajanje('');
      setUkupanBudzet('');
      setBudzetZaFon('');
      setOpis('');
      setCiljevi('');
      setPartnerskeInstitucije({
        koordinator: '',
        partneri: []
      });
      setPartneriText('');
      setClanoviProjektnogTima([])
      setWebsite('');
      setKljucneReci('');

      setSelectedId('')
      setFoundProject();

      setUgovorAction()
      setSelectedUgovor()
      setFileUgovor();
      setAneksiAction()
      setAllAneksi([])
      setSelectedAneks()
      setFilesAneksi([])
    }
  }
  useEffect(() => {
    if (id?.length == 24 && firstFire) {
      selectedProjectChanged(id, false)
    }
  }, [id, projects])
  useEffect(() => {
    if (selectedId) {
      selectedProjectChanged(selectedId, true)
    }
  }, [selectedId])


  const downloadUgovor = async () => {
    if (!foundProject) {
      setErrMsg("Projekat nije izabran.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (!foundProject.ugovor) {
      setErrMsg("Ne postoji ugovor za izabrani projekat.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    try {
      setErrMsg('');
      const response = await axiosPrivate.get(`/ugovor/${foundProject._id}`, {
        responseType: 'blob'
      });
      const contentType = response.headers['content-type']; // Get the content type of the response

      const fileExtension = '.' + contentType.split('/')[1];

      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `ugovor${fileExtension}`; // Set the appropriate file name and extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Remove the link element after clicking

      URL.revokeObjectURL(url);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Projekat ID je neophodan.');
      } else if (err.response?.status === 404) {
        setErrMsg('Projekat sa navedenim ID nije pronadjen.');
      } else if (err.response?.status === 500) {
        setErrMsg('Greska pri nalazenju fajla ugovora.');
      } else if (err.response?.status === 410) {
        setErrMsg('Nedostaje fajl ugovora.');
      } else {
        setErrMsg('Akcija nije uspela');
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  const deleteUgovor = async () => {

    if (!foundProject) {
      setErrMsg("Projekat nije izabran.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (!foundProject.ugovor) {
      setErrMsg("Ne postoji ugovor za izabrani projekat.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    try {
      // const response = await axiosPrivate.delete("/professors", OVAKO TREBA KOD DA IZGLEDA KADA GA STAVIS NA PARAMS
      //           {
      //               headers: { 'Content-Type': 'application/json' },
      //               withCredentials: true,
      //               data: {
      //                   id: selectedId
      //               }
      //           }
      //       );
      setErrMsg('');
      const response = await axiosPrivate.delete(`/ugovor/${foundProject._id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setViewSuccessModuo(true);
      
      setProjects(() => {
        const projWithoutTheOne = projects.filter(proj => proj._id != response.data._id)
        return [
          ...projWithoutTheOne,
          response.data]
      })
      setSelectedId(response.data._id)
      // TODO ovaj set selected id ne radi, tojest ne refresha se select (iako smo obrisali ugovor idalje stoji ta opcija)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Projekat ID je neophodan.');
      } else if (err.response?.status === 404) {
        setErrMsg('Projekat sa navedenim ID nije pronadjen.');
      } else if (err.response?.status === 500) {
        setErrMsg('Greska pri brisanju fajla ugovora.');
      } else if (err.response?.status === 410) {
        setErrMsg('Nedostaje fajl ugovora.');
      } else {
        setErrMsg('Akcija nije uspela');
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  const uploadUgovor = async () => {
    if (!foundProject) {
      setErrMsg("Projekat nije izabran.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    const fd = new FormData();
    const allowedFileExtensions = ["png", "jpeg", "txt", "pdf", "doc", "docx", "rtf", "xls"];
    if (typeof fileUgovor === "object") {
      if (!allowedFileExtensions.some((extension) => extension == fileUgovor.name.split('.').pop().toLowerCase())) {
        setErrMsg('fajl nije dozvojlenog tipa');
        // TODO PROVERI SVE ERRORE
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        console.log("fajl nije dozvojlenog tipa")
        console.log(fileUgovor)
        return;
      }
      fd.append("fileUgovor", fileUgovor);

    } else {
      setErrMsg('Nije izabran file za ugovor.');
      // TODO PROVERI SVE ERRORE
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    try {
      setErrMsg('');
      const response = await axiosPrivate.post(`/ugovor/${foundProject._id}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // withCredentials: true mora bez with credentials da bi se poslao fajl, kako radi ne znam, posto inace treba credentials da bi se poslao authorization header

      }
      );
      setViewSuccessModuo(true);
      
      setProjects(() => {
        const projWithoutTheOne = projects.filter(proj => proj._id != response.data._id)
        return [
          ...projWithoutTheOne,
          response.data]
      })
      setSelectedId(response.data._id)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Projekat ID je neophodan.');
      } else if (err.response?.status === 404) {
        setErrMsg('Projekat sa navedenim ID nije pronadjen.');
      } else if (err.response?.status === 500) {
        setErrMsg('Greska pri upravljanju fajlova na serveru.');
      } else if (err.response?.status === 417) {
        setErrMsg('Server nije primio fajl.');
      } else if (err.response?.status === 415) {
        setErrMsg('Server ne prihvata fajlove tog tipa.');
      } else if (err.response?.status === 413) {
        setErrMsg('Fajl je veci od 5MB.');
      } else {
        setErrMsg('Akcija nije uspela');
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  const downloadAneksi = async () => {

    if (!foundProject) {
      setErrMsg("Nije izabran projekat.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (!foundProject.aneksi) {
      setErrMsg("Ne postoje aneksi za izabrani projekat.");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }


    try {
      const response = await axiosPrivate.get(`/aneksi/${foundProject._id}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a');
      link.href = url;
      link.download = 'aneksi.zip';
      document.body.appendChild(link);
      link.click();
      document.body.appendChild(link);

      URL.revokeObjectURL(url);



    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Projekat ID je neophodan.');
      } else if (err.response?.status === 404) {
        setErrMsg('Projekat sa navedenim ID nije pronadjen.');
      } else if (err.response?.status === 500) {
        setErrMsg('Greska pri upravljanju fajlova na serveru.');
      } else if (err.response?.status === 410) {
        setErrMsg('Projekat nema anekse.');
      } else {
        setErrMsg('Akcija nije uspela');
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  const uploadAneksi = async () => {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const fd = new FormData();
    const allowedFileExtensions = ["png", "jpeg", "txt", "pdf", "doc", "docx", "rtf", "xls"];
    if (typeof filesAneksi === "object") {
      if (Object.keys(filesAneksi).map(key => filesAneksi[key].name).find(fileName => !allowedFileExtensions.some((extension) => extension == fileName.split('.').pop().toLowerCase()))) {

        setErrMsg("Fajl aneksa nije dozvoljenog tipa");
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }
      Object.keys(filesAneksi).forEach(key => {
        fd.append("filesAneksi", filesAneksi[key])
      });
    } else {
      setErrMsg('Nije izabran file za aneks');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    try {
      setErrMsg('');
      const response = await axiosPrivate.post(`/aneksi/${foundProject._id}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // withCredentials: true mora bez with credentials da bi se poslao fajl, kako radi ne znam, posto inace treba credentials da bi se poslao authorization header

      }
      );
      setViewSuccessModuo(true);
      setProjects(() => {
        const projWithoutTheOne = projects.filter(proj => proj._id != response.data._id)
        return [
          ...projWithoutTheOne,
          response.data]
      })
      setSelectedId(response.data._id)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Projekat ID je neophodan.');
      } else if (err.response?.status === 404) {
        setErrMsg('Projekat sa navedenim ID nije pronadjen.');
      } else if (err.response?.status === 500) {
        setErrMsg('Greska pri upravljanju fajlova na serveru.');
      } else if (err.response?.status === 417) {
        setErrMsg('Server nije primio fajl.');
      } else if (err.response?.status === 415) {
        setErrMsg('Server ne prihvata fajlove tog tipa.');
      } else if (err.response?.status === 413) {
        setErrMsg('Fajl je veci od 5MB.');
      } else if (err.response?.status === 409) {
        setErrMsg('Vec postoji fajl sa tim imenom.');
      } else {
        setErrMsg('Akcija nije uspela');
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
  const deleteAneks = async () => {
    if (!foundProject) {
      setErrMsg("Invalid project Id");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (!foundProject.aneksi) {
      setErrMsg("Ne postoje aneksi");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (!allAneksi.some(aneks => aneks == selectedAneks)) {
      setErrMsg("Ne posoji izabrani aneks");
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    try {

      setErrMsg('');
      const response = await axiosPrivate.delete(`/aneksi/${foundProject._id}/${selectedAneks}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setViewSuccessModuo(true);
      setProjects(() => {
        const projWithoutTheOne = projects.filter(proj => proj._id != response.data._id)
        return [
          ...projWithoutTheOne,
          response.data]
      })
      setSelectedId(response.data._id)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Projekat ID i ime aneksa su neophodni.');
      } else if (err.response?.status === 404) {
        setErrMsg('Projekat sa navedenim ID ili fajl sa navedenim imenom nije pronadjen.');
      } else if (err.response?.status === 500) {
        setErrMsg('Greska pri upravljanju fajlova na serveru.');
      } else {
        setErrMsg('Akcija nije uspela');
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
  return (
    <>


      <div className='add-professor-page-container'>
        <div className="view-add-professor-form-container">


          <form className="add-professor-form" onSubmit={handleSubmit}>

            <p className={errMsg ? "errmsg" : "offscreen"} >{errMsg}</p>
            <span className="add-professor-form-title">Izmeni projekat</span>
            <hr className="add-professor-form-seperator" />

            <div className='edit-professor-form-search-container'>
              <SearchSpecificProjectBar projects={projects} projectId={selectedId} setProjectId={setSelectedId} />

              <button type='reset' disabled={!selectedId ? true : false} onClick={() => setViewDeleteModuo(prev => !prev)} className='edit-professor-form-delete-button'>Obriši projekat</button>

            </div>

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
                  <span className='add-professor-form-name-input-description'>
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
                  <span className='add-professor-form-name-input-description' >
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


            </div>
            <hr className="add-professor-form-seperator" />

            <button type="submit" disabled={!validNazivProjekta || !validVrstaProjekta ? true : false} className="add-professor-form-button-submit">Izmeni projekat</button>

          </form>
        </div>
        {
          selectedId ? (
            <div className="project-files-container">
              <div className="add-professor-form-name-inputs-container">
                <div className="add-professor-form-name-inputs-left">
                  <label htmlFor="ukupanBudzet" className="add-professor-form-label">
                    Ugovor
                  </label>
                  <select
                    id="vrstaProjekta"
                    onChange={(e) => { setUgovorAction(e.target.value) }}
                    value={ugovorAction}
                    className='projects-select-component'
                  >
                    <option value="" className='projects-select-option'>Izaberite</option>
                    <option value="upload" className='projects-select-option'>Upload</option>
                    {selectedUgovor ? (
                      <>
                        <option value="download" className='projects-select-option'>Download</option>
                        <option value="delete" className='projects-select-option'>Delete</option>
                      </>
                    ) : ""
                    }
                  </select>
                  {selectedUgovor ? (
                    <span className='add-professor-form-name-input-description'>
                      Izaberite akciju za ugovor: {selectedUgovor}
                    </span>
                  ) : (
                    <span className='add-professor-form-name-input-description'>
                      Projekat nema ugovor u bazi, izaberite akciju.
                    </span>
                  )}

                </div>
                <div className="add-professor-form-name-inputs-right">
                  {
                    ugovorAction === "download" ? (
                      <>
                        <label className="add-professor-form-label">
                          Download ugovor
                        </label>
                        <button type='button' onClick={() => downloadUgovor()} className='professors-home-table-body-edit-cell-button'>Download ugovor</button>

                        <span className='add-professor-form-name-input-description'>
                          Ova akcija ce downloadati ugovor.
                        </span>
                      </>

                    ) : ugovorAction === "upload" ? (
                      <>
                        <label className="add-professor-form-label">
                          Upload novi ugovor
                        </label>
                        <input type="file" name="" id="" onChange={(e) => { setFileUgovor(e.target.files[0]) }} accept=".png,.jpeg,.txt,.pdf,.doc,.docx,.rtf,.xls" />
                        <button type='button' disabled={fileUgovor ? false : true} onClick={() => uploadUgovor()} className='professors-home-table-body-edit-cell-button'>Upload ugovor</button>
                        <span className='add-professor-form-information-input-description'>
                          <br />Ova akcija ce obrisati prethodni ugovor ako postoji.<br />
                          Dozvoljeni su fajlovi tipa: .png, .jpeg, .txt, .pdf, .doc, .docx, .rtf, .xls <br />
                          Jedan fajl ne sme da predje 5MB
                        </span>
                      </>
                    ) : ugovorAction === "delete" ? (
                      <>
                        <label className="add-professor-form-label">
                          Brisanje ugovora
                        </label>
                        <button type='button' onClick={() => deleteUgovor()} className='professors-home-table-body-edit-cell-button'>Delete ugovor</button>
                        <span className='add-professor-form-name-input-description'>
                          Ova akcija ce obrisati ugovor ako postoji.
                        </span>
                      </>
                    ) : (
                      null
                    )

                  }
                </div>
              </div>

              {

              }
              <div className="add-professor-form-name-inputs-container">
                <div className="add-professor-form-name-inputs-left">
                  <label htmlFor="ukupanBudzet" className="add-professor-form-label">
                    Aneksi
                  </label>
                  <select
                    id="vrstaAneksa"
                    onChange={(e) => { setAneksiAction(e.target.value) }}
                    value={aneksiAction}
                    className='projects-select-component'
                  >
                    <option value="" className='projects-select-option'>Izaberite</option>
                    <option value="upload" className='projects-select-option'>Upload</option>
                    {
                      allAneksi?.length ? (
                        <>
                          <option value="download" className='projects-select-option'>Download</option>
                          <option value="delete" className='projects-select-option'>Delete</option>
                        </>
                      ) : ""
                    }

                  </select>
                  {allAneksi ? (
                    <span className='add-professor-form-name-input-description'>
                      Izaberite akciju za anekse: {allAneksi.toString()}
                    </span>
                  ) : (
                    <span className='add-professor-form-name-input-description'>
                      Projekat nema anekse u bazi, izaberite akciju.
                    </span>
                  )}
                </div>
                <div className="add-professor-form-name-inputs-right">
                  {
                    aneksiAction === "download" ? (
                      <>
                        <label className="add-professor-form-label">
                          Download sve anekse
                        </label>
                        <button type='button' onClick={() => downloadAneksi()} className='professors-home-table-body-edit-cell-button'>Download aneksi</button>

                        <span className='add-professor-form-name-input-description'>
                          Ova akcija ce downloadati sve postojace anekse za projekat.
                        </span>
                      </>

                    ) : aneksiAction === "upload" ? (
                      <>
                        <label className="add-professor-form-label">
                          Upload novi aneks
                        </label>
                        <input type="file" name="" id="" multiple onChange={(e) => { setFilesAneksi(e.target.files) }} accept=".png,.jpeg,.txt,.pdf,.doc,.docx,.rtf,.xls" />
                        <button type='button' disabled={filesAneksi ? false : true} onClick={() => uploadAneksi()} className='professors-home-table-body-edit-cell-button'>Upload aneksi</button>
                        <span className='add-professor-form-information-input-description'>
                          <br />Dozvoljeni su fajlovi tipa: .png, .jpeg, .txt, .pdf, .doc, .docx, .rtf, .xls <br />
                          Jedan fajl ne sme da predje 5MB
                        </span>
                      </>
                    ) : aneksiAction === "delete" ? (
                      <>
                        <label className="add-professor-form-label">
                          Brisanje aneksa
                        </label>
                        <select
                          id="izabraniAneks"
                          onChange={(e) => { setSelectedAneks(e.target.value) }}
                          value={selectedAneks}
                          className='projects-select-component'
                        >
                          <option value="" className='projects-select-option'>Izaberite</option>
                          {
                            allAneksi?.map(aneks => (
                              <option value={aneks} className='projects-select-option'>{aneks}</option>
                            ))
                          }
                        </select>
                        <button type='button' disabled={selectedAneks ? false : true} onClick={() => deleteAneks()} className='professors-home-table-body-edit-cell-button'>Delete aneks</button>

                        <span className='add-professor-form-name-input-description'>
                          Ova akcija ce obrisati izabrani aneks.
                        </span>
                      </>
                    ) : (
                      null
                    )

                  }
                </div>
              </div>

            </div>
          ) : ""
        }

      </div>
      {viewDeleteModuo &&
        <DeleteModuo placeholder="projekat" setViewDeleteModuo={setViewDeleteModuo} handleDelete={handleDelete} />
      }
      {viewSuccessModuo &&
        <SuccessModuo placeholder="izmenili projekat u nasoj bazi" setViewSuccessModuo={setViewSuccessModuo} />
      }
    </>
  )
}
