import React from 'react'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
export default function PdfGenerator({ filtriraniProfesori }) {
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
            backgroundColor:"#d5d0ca",
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
            backgroundColor:"#d5d0ca",
            width: "100%",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableD: {

        },
        tempRow:{
            flexDirection: "row",
             marginBottom: 4
        }
    });
    const MyDoc = () => (
        <Document>
            {
                filtriraniProfesori?.map((prof, index) => {
                    return (
                        <Page key={index}>
                            <View style={styles.basic}>
                                <Text>Fakultet organizacionih nauka - logo</Text>
                                <View style={styles.table}>
                                    <View style={styles.tableHeader}>
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableH} >
                                                <Text style={{margin: "auto", marginVertical: 5,fontSize: 10}}>Informacije o Profesoru</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.tableBody}>
                                        <View style={styles.tableRow} >
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Titula, Ime, Prezime </Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>{prof.title} {prof.firstname} {prof.lastname}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRow} >
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Naucno Istrazivanje</Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>{prof.scientificResearch.map((data, index) => {
                                                    return (
                                                        <Text key={index}>- {data + "\n"}</Text>
                                                    )
                                                })}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRow} >
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Labaratorije</Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>{prof.labaratories.map((data, index) => {
                                                    return (
                                                        <Text key={index}>- {data + "\n"}</Text>
                                                    )
                                                })}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRow} >
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Naucni Projekti</Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>
                                                    <View style={{ flexDirection: "column" }}>

                                                        {prof.scientificProjects.map((data, index) => {
                                                            return (
                                                                <View key={index} style={{ marginBottom: 4, flexDirection: "row" }}>
                                                                    <Text style={{ marginRight: 8 }}>{index + 1 + "."}</Text>
                                                                    <Text>{data + '\n'}</Text>
                                                                </View>
                                                            )
                                                        })}
                                                    </View>
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableColKey}>
                                                <Text style={styles.tableCell}>Najznacajnije Publikacije</Text>
                                            </View>
                                            <View style={styles.tableColData}>
                                                <Text style={styles.tableCell}>
                                                    <View style={{ display:"flex",flexDirection: "column" }}>
                                                        {prof.significantPublications.map((data, index) => {
                                                            return (
                                                                <View key={index} style={{ display:"flex",flexDirection: "row", marginBottom: 4 }}>
                                                                    <Text style={{ marginRight: 8 }}>{index + 1 + "."}</Text>
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
        <PDFDownloadLink document={<MyDoc />} fileName="profesori.pdf">
            {({ blob, url, loading, error }) =>
                loading ? (<button disabled={true}className='pdfResultBtn'>Loading document...</button>) : (<button className='pdfResultBtn'>Eksportuj u PDF</button>)
            }
        </PDFDownloadLink>
    )
}
