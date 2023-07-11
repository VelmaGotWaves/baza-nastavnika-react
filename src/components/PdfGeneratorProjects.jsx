import React, { useState, useEffect } from 'react'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import pdfimg from '../images/pdf.png'

export default function PdfGeneratorProjects({ filtriraniProjekti, professors }) {
    const [generateDoc, setGenerateDoc] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setGenerateDoc(false);
        setIsLoading(false);
    }, [filtriraniProjekti])
    
    Font.register({
        family: 'Roboto',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
    });
    const styles = StyleSheet.create({
        basic: {
            fontFamily: 'Roboto',
            margin: 50
        },
        table: {
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0
        },
        tableRow: {
            margin: "auto",
            flexDirection: "row"
        },
        tableColKey: {
            backgroundColor: "#d5d0ca",
            width: "25%",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableColData: {
            width: "75%",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableCell: {
            margin: 5,
            fontSize: 10
        },
        tableHeader: {

        },
        tableBody: {

        },
        tableH: {
            backgroundColor: "#d5d0ca",
            width: "100%",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableD: {

        },
        tempRow: {
            flexDirection: "row",
            marginBottom: 4
        }
    });
    const MyDoc = () => {
        if (generateDoc) {
            setIsLoading(true)
            return (
                <Document>
                    {
                        filtriraniProjekti?.map((proj, index) => {
                            const admininstrator = professors.find(prof => prof._id == proj.administrator)
                            const rukovodilac = professors.find(prof => prof._id == proj.rukovodilac)
                            return (
                                <Page key={index}>
                                    <View style={styles.basic}>
                                        <View style={styles.table}>
                                            <View style={styles.tableHeader}>
                                                <View style={styles.tableRow}>
                                                    <View style={styles.tableH} >
                                                        <Text style={{ margin: "auto", marginTop: 5, fontSize: 10 }}>Informacije o Projektu /</Text>
                                                        <Text style={{ margin: "auto", marginBottom: 5, fontSize: 10 }}>Project info</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.tableBody}>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Naziv projekta/Project Title</Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.nazivProjekta}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Naziv programa/Program </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.nazivPrograma}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Referentni broj/ Reference number</Text>
                                                        <Text style={styles.tableCell}>Interni broj/Internal number </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.referentniBroj}</Text>
                                                        <Text style={styles.tableCell}>{proj.interniBroj}</Text>

                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Vrsta projekta/Scope </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.vrstaProjekta}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Ukupan budzet/ Total Budget </Text>
                                                        <Text style={styles.tableCell}>Budzet za FON /FON budget</Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.ukupanBudzet}</Text>
                                                        <Text style={styles.tableCell}>{proj.budzetZaFon}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Profitni centar </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.profitniCentar}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Planirani pocetak/ Planned start </Text>
                                                        <Text style={styles.tableCell}>Planirani zavrsetak/ Planned finish </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.planiraniPocetak ? `${new Date(proj.planiraniPocetak).getDate()}.${new Date(proj.planiraniPocetak).getMonth() + 1}.${new Date(proj.planiraniPocetak).getFullYear()}` : ""}</Text>
                                                        <Text style={styles.tableCell}>{proj.planiraniZavrsetak ? `${new Date(proj.planiraniZavrsetak).getDate()}.${new Date(proj.planiraniZavrsetak).getMonth() + 1}.${new Date(proj.planiraniZavrsetak).getFullYear()}` : ""}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Trajanje / Duration </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.trajanje}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Website </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.website}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Administrator/ Administrator </Text>
                                                        <Text style={styles.tableCell}>Koordinator/ Leader </Text>

                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{admininstrator?.titula} {admininstrator?.ime} {admininstrator?.prezime}</Text>
                                                        <Text style={styles.tableCell}>{rukovodilac?.titula} {rukovodilac?.ime} {rukovodilac?.prezime}</Text>

                                                    </View>
                                                </View>
                                                
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Opis / Summary</Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.opis}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Ciljevi / Objectives </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.ciljevi}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Partnerske institucije: koordinator / Coordinator </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        <Text style={styles.tableCell}>{proj.partnerskeInstitucije.koordinator}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Partnerske institucije: partneri / Partner institutions</Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        {
                                                            proj.partnerskeInstitucije.partneri.map(partner => (
                                                                <Text style={styles.tableCell}>{partner} {"\n"}</Text>
                                                            ))
                                                        }
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Clanovi projektnog tima/ Project team members </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        {
                                                            proj.clanoviProjektnogTima.map(clanProjektnogTima => {
                                                                const clan = professors.find(lol => lol._id == clanProjektnogTima)
                                                                return (
                                                                    <Text style={styles.tableCell}>{clan?.titula} {clan?.ime} {clan?.prezime} {"\n"}</Text>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                                <View style={styles.tableRow} >
                                                    <View style={styles.tableColKey}>
                                                        <Text style={styles.tableCell}>Kljucne reci/ Key words </Text>
                                                    </View>
                                                    <View style={styles.tableColData}>
                                                        {
                                                            proj.kljucneReci.map(rec => (
                                                                <Text style={styles.tableCell}>{rec} {"\n"}</Text>
                                                            ))
                                                        }
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                </Page>
                            )
                        })
                    }
                </Document>
            );
        } else {
            return null;
        }
    }
    
    if (generateDoc) {
        return (
            <PDFDownloadLink document={<MyDoc />} fileName="projekti.pdf" className='no-underline'>
                {({ blob, url, loading, error }) =>
                    loading ? (
                        <button type="button"  className='professors-home-content-utils-buttons-pdf'>
                            <img src={pdfimg} alt="" className='professors-home-content-utils-buttons-pdf-img' />
                            <span className='professors-home-content-utils-buttons-pdf-span'>
                                Loading document...
                            </span>
                        </button>
                    ) :
                        (
                            <button type="button" onClick={()=> {setTimeout(()=> setGenerateDoc(false),0); setTimeout(()=> setIsLoading(false),0)}}className='professors-home-content-utils-buttons-pdf'>
                                <img src={pdfimg} alt="" className='professors-home-content-utils-buttons-pdf-img' />
                                <span className='professors-home-content-utils-buttons-pdf-span'>
                                    Eksportuj u PDF
                                </span>
                            </button>
                        )
                }
            </PDFDownloadLink>
        )
    } else {
        return (
            <button type="button" onClick={()=> setGenerateDoc(true)}className='professors-home-content-utils-buttons-pdf'>
                <img src={pdfimg} alt="" className='professors-home-content-utils-buttons-pdf-img' />
                <span className='professors-home-content-utils-buttons-pdf-span'>
                    {isLoading?"Loading PDF":"Generisi PDF"}
                </span>
            </button>
        )
    }

}
