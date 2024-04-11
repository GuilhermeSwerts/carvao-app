import React, { useEffect, useState } from 'react';

import Filter from '../../components/filter/filter';
import GestaoTable from './gestaoTable';
import { api } from '../../components/api/api';

function Gestao() {
    const [pedidos, setPedidos] = useState([]);
    const [statusPagamento, setStatusPagamento] = useState([]);
    const [statusPedido, setStatusPedido] = useState([]);
    const [dtInicio, setDtInicio] = useState('');
    const [dtFim, setDtFim] = useState('');
    const [produtos, setProdutos] = useState([]);

    const BuscarTodosPedidos = () => {
        api.get(`api/Pedidos/BuscarTodos?dtInicio=${dtInicio}&dtFim=${dtFim}`, res => {
            setStatusPagamento(res.data.statusPagamento);
            setStatusPedido(res.data.statusPedido);
            setPedidos(res.data.pedidos);
        }, erro => {
            alert('Houve um erro na solicitação!');
        })
    }

    const BuscarTodosProdutos = () => {
        api.get("/api/Produto/BuscarTodos", res => {
            setProdutos(res.data);
        }, erro => {
            alert(erro.mensage)
        })
    }


    useEffect(() => { BuscarTodosPedidos(); BuscarTodosProdutos(); }, []);

    return (
        <section className='app'>
            <div className="content">
                <h1>Gestão de Pedidos</h1>
                <Filter
                    fetchClientes={BuscarTodosPedidos}
                    setDataInicio={setDtInicio}
                    setDataFim={setDtFim}
                    dataInicio={dtInicio}
                    dataFim={dtFim}
                    showNovoCliente={false}
                    showFiltroNome={false}
                />
                <GestaoTable
                    produtos={produtos}
                    pedidos={pedidos}
                    statusPedido={statusPedido}
                    statusPagamento={statusPagamento}
                />
            </div>
        </section>
    );
}

export default Gestao;