import React from 'react';

import { format } from 'date-fns';
import {
    PDFDownloadLink,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        flexDirection: "column",
        backgroundColor: "#fff",
        fontFamily: "Helvetica",
        fontSize: 12,
        lineHeight: 1.5,
    },
    header: {
        backgroundColor: "#28d",
        color: "#fff",
        padding: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    companyName: {
        fontSize: 15,
        textAlign: "center",
        marginBottom: 3,
    },
    content: {
        paddingHorizontal: 35,
        marginBottom: 15,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    signatureSpace: {
        marginTop: 20, // Space above signature line
        marginBottom: 5, // Space below signature line
    },
    dateSpace: {
        marginBottom: 5, // Space below the date line
    },
    detailsSection: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: '10px'
    },
    detailItem: {
        marginBottom: 10,
        width: '100%',
    },
    detailTitle: {
        fontWeight: "bold",
        marginBottom: 3,
    },
    detailValue: {
        fontSize: 12,
        marginBottom: 5,
    },
    containerRow: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        gap: 10
    }
});

export const ReciboPDF = ({ tipoPagamento, cliente, pedido, reciboId, data, pedidoId }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.companyName}>
                    Kompleto Carvao e Assesoria LTDA
                </Text>
                <Text style={{ textAlign: "center" }}>CNPJ: 52.808.774/0001-47</Text>
                <Text style={styles.title}>Recibo {reciboId}</Text>
            </View>

            <View style={styles.detailsSection}>
                {/* Coluna Esquerda */}
                <View style={styles.detailItem}>
                    <View style={styles.containerRow}>
                        <Text style={styles.detailTitle}>Nome Cliente:</Text>
                        <Text style={styles.detailValue}>{cliente?.nome}</Text>
                    </View>

                    <View style={styles.containerRow}>
                        <Text style={styles.detailTitle}>{cliente?.pessoaFisica ? "CPF" : "CNPJ:"}</Text>
                        <Text style={styles.detailValue}>{cliente?.pessoaFisica ? cliente?.cpf : cliente.cnpj}</Text>
                    </View>

                    <View style={styles.containerRow}>
                        <Text style={styles.detailTitle}>Valor Pago</Text>
                        <Text style={styles.detailValue}>R$ {data.ValorPagar}</Text>
                    </View>

                    <View style={styles.containerRow}>
                        <Text style={styles.detailTitle}>Forma de Pagamento:</Text>
                        <Text style={styles.detailValue}>{tipoPagamento.filter(x => x.tipo_pagamento_id === data.FormaPagamento).length > 0 ? tipoPagamento.filter(x => x.tipo_pagamento_id === data.FormaPagamento)[0].nome : ""}</Text>
                    </View>
                </View>

                {/* Coluna Direita */}
                <View style={styles.detailItem}>
                    <View style={styles.containerRow}>
                        <Text style={styles.detailTitle}>Data do Pedido:</Text>
                        <Text style={styles.detailValue}>
                            {pedido && format(pedido.data_pedido, "dd/MM/yyyy")}
                        </Text>
                    </View>

                    <View style={styles.containerRow}>
                        <Text style={styles.detailTitle}>Nome do Pagador:</Text>
                        <Text style={styles.detailValue}>{data.NomePagador}</Text>
                    </View>
                    <View style={styles.containerRow}>
                        <Text style={styles.detailTitle}>Código Do Pedido:</Text>
                        <Text style={styles.detailValue}>{pedidoId}</Text>
                    </View>
                    <View style={styles.containerRow}>
                        <Text style={styles.detailTitle}>Valor Total:</Text>
                        <Text style={styles.detailValue}>
                            R$ {pedido?.valor_total.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>
            {/* Continuação da coluna esquerda com espaçamento extra */}
            <View style={{ ...styles.detailItem, width: "100%" }}>
                <View style={styles.containerRow}>
                    <Text style={styles.detailTitle}>Saldo Devedor:</Text>
                    <Text style={styles.detailValue}>
                        {pedido &&
                            pedido.saldo_devedor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                    </Text>
                </View>
                <Text style={styles.detailTitle}>Observações:</Text>
                <Text style={styles.detailValue}>{data.Observacao}</Text>
            </View>
        </Page>
    </Document>
);