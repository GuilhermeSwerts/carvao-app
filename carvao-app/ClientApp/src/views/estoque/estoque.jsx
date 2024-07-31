import React, { useEffect, useState } from 'react';
import { api } from '../../components/api/api';
import { Alert } from '../../util/Alertas';
import { FaBoxes, FaPlus } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import ModalEditarEstoque from '../../components/Modals/Estoque/Editar';
import Produto from '../../components/Modals/Produto/Produto';
import { BsInboxesFill } from 'react-icons/bs';

function Estoque() {
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltro, setProdutosFiltro] = useState([]);
    const [filtroNome, setFiltroNome] = useState(``);

    const BuscarProdutos = () =>
        api.get('/api/Estoque', res => { setProdutos(res.data); setProdutosFiltro(res.data) }, err => Alert('Houve um erro ao buscar os prdutos', false));

    useEffect(BuscarProdutos, []);

    const FiltroNome = e => {
        setFiltroNome(e.target.value);
        setProdutosFiltro(produtos.filter(produto => produto.nome.toUpperCase().includes(e.target.value.toUpperCase())))
    }

    const NovoProduto = (produto) => {
        if (produto.valor < produto.valorMinimo) {
            Alert("Valor do produto deve ser maior que o valor minimo", false, true)
            return;
        }

        produto.valor = (produto.valor + '').replaceAll(',', '.')
        produto.valorMinimo = (produto.valor + '').replaceAll(',', '.')

        var data = new FormData();
        data.append("data", JSON.stringify(produto));
        api.post("api/Produto", data, res => {
            BuscarProdutos();
            const loader = document.getElementById(`loadingpanel`);
            if (loader)
                loader.style.display = 'none';
            Alert('Produto adicionado com sucesso!', true);
        }, erro => {
            Alert(erro.response ? erro.response.data : "Houve um erro na solicitação!", false)
        })
    }

    const EditarProduto = () => { }

    return (
        <div className="content">
            <div className="container-table">
                <div style={{
                    padding: '1rem',
                    background: '#28d',
                    color: '#fff',
                    width: '100%',
                    margin: '0'
                }}
                    className='row'
                >
                    <div style={{ display: 'flex', justifyContent: 'end', marginRight: 20 }}>
                        <Produto
                            top={true}
                            textSubmit="Cadastrar Produto"
                            classButton="btn btn-success"
                            onSubmit={NovoProduto}
                            tooltip='Novo Produto'
                            icon={<FaPlus size={20} color='#fff' />} />
                    </div>
                    <div class="col-md-12" style={{ marginBottom: '10px' }}>
                        <label for="validationTooltipUsername">Filtros:</label>
                        {<div class="input-group">
                            <input
                                type="text"
                                placeholder="Nome do produto"
                                value={filtroNome}
                                className='form-control'
                                onChange={FiltroNome}
                            />
                        </div>}
                    </div>
                </div>
                <br />
                <div className='row'>
                    <div className="col-md-12">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome Do Produto</th>
                                    <th>Quantidade em estoque</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtosFiltro.map((produto, i) => {
                                    produto.produto_id = produto.id
                                    return (
                                        <tr key={produto.produto_id}>
                                            <td data-label="#">{produto.produto_id}</td>
                                            <td data-label="Nome Do Produto">{produto.nome}</td>
                                            <td data-label="Quantidade em estoque">{produto.quantidade}</td>
                                            <td data-label="Ações" style={{ display: 'flex', gap: 10 }}>
                                                <ModalEditarEstoque AtualizaTela={BuscarProdutos} ProdutoId={produto.produto_id} Quantidade={produto.quantidade} key={produto.produto_id} />
                                            </td>
                                        </tr>
                                    )
                                })}
                                {produtosFiltro.length == 0 && <tr>
                                    <td><span>Não foi encontrado nenhum produto...</span></td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Estoque;