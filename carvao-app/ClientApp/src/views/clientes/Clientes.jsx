import React, { useState, useEffect } from "react";
import ClienteListViewTable from './ClientesTable';
import InputMask from "react-input-mask";
import { api } from "../../components/api/api";
import ModalNovoCliente from "../../components/Modals/Clients/NovoCliente";
import DetalhesDoCliente from '../../components/Modals/Clients/DetalhesCliente';
import Filter from '../../components/filter/filter';
import { GetDataUser } from "../../util/GetDataUser";
import { buscarClientes } from "../../components/api/apiMiddle";
import { eTipoDownload } from "../../enum/eTipoDownload";
import { FaUsers } from "react-icons/fa";
import { Alert, Pergunta } from "../../util/Alertas";

function ClienteListView() {
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [filtroNome, setFiltroNome] = useState("");
    const [clienteData, setClienteData] = useState({});
    const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
    const [isPessoaFisica, setIsPessoaFisica] = useState(true);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const usuario = GetDataUser();

    const fetchClientes = (query, dtInicio, dtFim) => {

        api.get(`api/Cliente/BuscarClientes?q=${query || ""}&dtInicio=${dtInicio || ""}&dtFim=${dtFim || ""}`, res => {
            setClientes(res.data);
        }, error => {
            Alert("Erro ao buscar clientes: " + error, false);

        })
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleAbrirModal = (cliente) => {
        if (cliente) {
            setIsPessoaFisica(cliente.pessoaFisica);
            setClienteData(cliente);
            setClienteSelecionado(cliente);
        } else {
            setIsPessoaFisica(true);
            setClienteData({});
            setClienteSelecionado(null);
        }
        setModalAberto(true);
    };

    const handleAbrirModalDetalhe = (cliente) => {
        setClienteSelecionado(cliente);
        setModalDetalhesAberto(true);
    };

    const handleSalvarCliente = async () => {
        try {
            if (clienteSelecionado)
                clienteData.clienteId = clienteSelecionado.clienteId;

            clienteData.PessoaFisica = isPessoaFisica;
            api.post(`api/Cliente/${clienteSelecionado ? "AtualizaDadosCliente" : "NovoCliente"}`,
                clienteData, res => {

                    const loader = document.getElementById(`loadingpanel`);
                    if (loader)
                        loader.style.display = 'none';

                    fetchClientes();
                    setModalAberto(false);
                    Alert("Cliente salvo com sucesso!");
                }, erro => {
                    const msg = erro.response ? erro.response.data : erro.message;
                    Alert(msg, false);
                });

        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
        }
    };

    const handleInputChange = async (event) => {
        const { value } = event.target;
        fetchClientes(value, dataInicio, dataFim);
        setFiltroNome(value);
    };

    const toggleStatus = async (statusAtual, id) => {
        if (await Pergunta("Deseja realmente atualizar o status desse cliente?"))
            try {
                api.post(`api/Cliente/${statusAtual ? "AtivaCliente" : "InativaCliente"}/${id}`,
                    {}, res => {
                        fetchClientes();
                        Alert("Cliente atualizado com sucesso!");
                    });
            } catch (error) {
                Alert("Erro ao alterar o status do cliente", false);
            }
    };

    return (
        <div className="App" style={{ width: '100%' }}>
            <ModalNovoCliente
                modalAberto={modalAberto}
                setModalAberto={setModalAberto}
                setIsPessoaFisica={setIsPessoaFisica}
                clienteData={clienteData}
                setClienteData={setClienteData}
                handleSalvarCliente={handleSalvarCliente}
                InputMask={InputMask}
                isPessoaFisica={isPessoaFisica}
                clienteSelecionado={clienteSelecionado}
            />
            <DetalhesDoCliente
                modalDetalhesAberto={modalDetalhesAberto}
                setModalDetalhesAberto={setModalDetalhesAberto}
                clienteSelecionado={clienteSelecionado}
            />
            <div className="content">
                <button onClick={() => window.history.go(-1)} className="btn btn-link">Voltar</button>
                <h1>Meus Clientes <FaUsers /> </h1>
                <div className="container-table">
                    <Filter
                        filtroNome={filtroNome}
                        handleInputChange={handleInputChange}
                        handleAbrirModal={handleAbrirModal}
                        setDataInicio={setDataInicio}
                        setDataFim={setDataFim}
                        fetchClientes={fetchClientes}
                        dataInicio={dataInicio}
                        dataFim={dataFim}
                        showNovoCliente={true}
                        tipoDownload={eTipoDownload.Clientes}
                        extrairDados={true}
                    />
                    <br />
                    <ClienteListViewTable
                        clientes={clientes}
                        toggleStatus={toggleStatus}
                        handleAbrirModal={handleAbrirModal}
                        handleAbrirModalDetalhe={handleAbrirModalDetalhe}
                    />
                </div>
            </div>
        </div>
    );
}

export default ClienteListView;
