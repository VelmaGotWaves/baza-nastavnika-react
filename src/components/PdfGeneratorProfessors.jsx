import React from 'react'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import pdfimg from '../images/pdf.png'
export default function PdfGeneratorProfessors({ filtriraniProfesori, projects }) {
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
    console.log(filtriraniProfesori)
    const MyDoc = () => (
        <Document>
            {
                filtriraniProfesori?.map((prof, index) => {
                    return (
                        <Page key={index}>
                            <View style={styles.basic}>
                                <View style={styles.table}>
                                    <View style={styles.tableHeader}>
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableH} >
                                                <Text style={{ margin: "auto", marginVertical: 5, fontSize: 10 }}>Informacije o Profesoru</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.tableBody}>
                                        <View style={styles.tableRow} >
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Titula, Ime, Prezime </Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>{prof.titula} {prof.ime} {prof.prezime}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRow} >
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Oblasti Istrazivanja</Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>{prof.oblastiIstrazivanja.map((data, index) => {
                                                    return (
                                                        <Text key={index}>- {data + "\n"}</Text>
                                                    )
                                                })}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRow} >
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Katedre</Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>{prof.katedre.map((data, index) => {
                                                    return (
                                                        <Text key={index}>- {data + "\n"}</Text>
                                                    )
                                                })}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRow} >
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Projekti</Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>
                                                    <View style={{ flexDirection: "column" }}>

                                                        {prof.projekti?.map((data, index) => {

                                                            const projekat = projects?.filter(proj => proj._id == data.projekatId);
                                                            // console.log(data) VELIKI PROBLEM OVDE NEKAD DAJE NULL IAKO IMAJU PROJEKTI
                                                            return (
                                                                <View key={index} >
                                                                    <Text >{index + 1 + "."}</Text>
                                                                    <Text>{projekat[0]?.nazivPrograma + projekat[0]?.nazivProjekta + " (" + data.uloga + ')\n'}</Text>
                                                                </View>
                                                            )
                                                        })}
                                                    </View>
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Publikacije</Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>
                                                    <View style={{ display: "flex", flexDirection: "column" }}>
                                                        {prof.publikacije.map((data, index) => {
                                                            return (
                                                                <View key={index} >
                                                                    <Text >{index + 1 + "."}</Text>
                                                                    <Text >{data + '\n'}</Text>
                                                                </View>
                                                            )
                                                        })}
                                                    </View>
                                                </Text>
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
    return (
        <PDFDownloadLink document={<MyDoc />} fileName="profesori.pdf" className='no-underline'>
            {({ blob, url, loading, error }) =>
                loading ? (
                    <button type="button"className='professors-home-content-utils-buttons-pdf'>
                        <img src={pdfimg} alt="" className='professors-home-content-utils-buttons-pdf-img' />
                        <span className='professors-home-content-utils-buttons-pdf-span'>
                            Loading document...
                        </span>
                    </button>
                ) :
                    (
                        <button type="button"className='professors-home-content-utils-buttons-pdf'>
                            <img src={pdfimg} alt="" className='professors-home-content-utils-buttons-pdf-img' />
                            <span className='professors-home-content-utils-buttons-pdf-span'>
                                Eksportuj u PDF
                            </span>
                        </button>
                    )
            }
        </PDFDownloadLink >
    )
}
