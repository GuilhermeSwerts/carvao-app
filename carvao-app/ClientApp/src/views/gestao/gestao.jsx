import React, { useEffect, useState } from 'react';

import { eTipoDownload } from '../../enum/eTipoDownload';
import Filter from '../../components/filter/filter';
import GestaoTable from './gestaoTable';
import { api } from '../../components/api/api';
import { FaGears } from 'react-icons/fa6';
import { Alert } from '../../util/Alertas';

function Gestao() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosFiltro, setPedidoFiltro] = useState([]);
    const [statusPagamento, setStatusPagamento] = useState([]);
    const [statusPedido, setStatusPedido] = useState([]);
    const [dtInicio, setDtInicio] = useState('');
    const [dtFim, setDtFim] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [nome, setNome] = useState('');

    const BuscarTodosPedidos = () => {
        api.get(`api/Pedidos/BuscarTodos?q=${nome}&dtInicio=${dtInicio}&dtFim=${dtFim}`, res => {
            setStatusPagamento(res.data.statusPagamento);
            setStatusPedido(res.data.statusPedido);
            setPedidos(res.data.pedidos);
            setPedidoFiltro(res.data.pedidos);
        }, erro => {
            Alert('Houve um erro na solicitação!', false);
        })
    }


    const BuscarTodosProdutos = () => {
        api.get("/api/Produto/BuscarTodos", res => {
            setProdutos(res.data);
        }, erro => {
            Alert(erro.mensage, false)
        })
    }

    useEffect(() => { BuscarTodosPedidos(); BuscarTodosProdutos(); }, []);

    const onChangeFiltroStatusPedido = e => {
        const value = e.target.value;
        if (value == "0" || value == 0) {
            setPedidoFiltro(pedidos);
        } else {
            setPedidoFiltro(pedidos.filter(x => x.status_pedido_id === parseInt(value)))
        }
    }

    return (
        <section className='app'>
            <div className="content">
                <Filter
                    fetchClientes={BuscarTodosPedidos}
                    setDataInicio={setDtInicio}
                    setDataFim={setDtFim}
                    dataInicio={dtInicio}
                    dataFim={dtFim}
                    showNovoCliente={false}
                    showFiltroNome={true}
                    filtroNome={nome}
                    filtroStatusPedido={true}
                    statusPedido={statusPedido}
                    onChangeFiltroStatusPedido={onChangeFiltroStatusPedido}
                    handleInputChange={e => { setNome(e.target.value); BuscarTodosPedidos() }}
                    extrairDados={true}
                    tipoDownload={eTipoDownload.GestaoPedidos}
                />
                <GestaoTable
                    ReloadPage={BuscarTodosPedidos}
                    produtos={produtos}
                    pedidos={pedidosFiltro}
                    statusPedido={statusPedido}
                    statusPagamento={statusPagamento}
                />
            </div>
        </section>
    );
}

export default Gestao;