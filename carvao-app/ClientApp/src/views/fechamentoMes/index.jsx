import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../components/api/api';
import Filter from '../../components/filter/filter';
import { CgDetailsMore } from "react-icons/cg";
import ModalDetalhesPedidosVendedor from '../../components/Modals/Usuario/ModalDetalhesPedidosVendedor';

function FechamentoMes() {
    const modal = useRef();
    const [vendedores, setVendedores] = useState([]);

    function GetPrimeiroDiaDoMes() {
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        return date.toISOString().split('T')[0];
    }

    function GetUltimoDiaDoMes() {
        const date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        return date.toISOString().split('T')[0];
    }

    const [dataInicio, setDataInicio] = useState(GetPrimeiroDiaDoMes());
    const [dataFim, setDataFim] = useState(GetUltimoDiaDoMes());

    const BuscarFechamentoMes = (dtIni, dtFim) => {
        dtIni = dtIni ? dtIni : dataInicio;
        dtFim = dtFim ? dtFim : dataFim;

        api.get(`Usuario/FechamentoMes?dataInicio=${dtIni}&dataFim=${dtFim}`, res => {
            setVendedores(res.data);
        }, err => console.log(res));
    }

    useEffect(() => BuscarFechamentoMes(GetPrimeiroDiaDoMes(), GetUltimoDiaDoMes()), [])

    const AbrirModal = (produtos,totalComissao) => {
        modal.current.AbrirModal(produtos,totalComissao);
    }

    return (
        <section className='content'>
            <ModalDetalhesPedidosVendedor ref={modal} />
            <div className="container-table">
                <Filter
                    showFiltroNome={false}
                    filtroNome={""}
                    handleInputChange={() => { }}
                    handleAbrirModal={() => { }}
                    setDataInicio={setDataInicio}
                    setDataFim={setDataFim}
                    fetchClientes={BuscarFechamentoMes}
                    dataInicio={dataInicio}
                    dataFim={dataFim}
                    showNovoCliente={false}
                    tipoDownload={0}
                    extrairDados={false}
                />
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome Do Vendedor</th>
                            <th>Valor Total Em Comissão</th>
                            <th>Historico De Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendedores.map((x, i) => (
                            <tr>
                                <td>{i + 1}</td>
                                <td>{x.nomeVendedor}</td>
                                <td>R$ {`${x.valorTotalComissao.toFixed(2)}`.replace('.', ',')}</td>
                                <td><button onClick={() => AbrirModal(x.pedidos, 'R$ ' + `${x.valorTotalComissao.toFixed(2)}`.replace('.', ','))} className='btn btn-warning'><CgDetailsMore color='#fff' /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default FechamentoMes;