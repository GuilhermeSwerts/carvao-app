import React, { useState, useEffect } from "react";
import ModalNovoPedido from '../../components/Modals/Clients/NovoPedido';
import ModalPedidosCliente from '../../components/Modals/Clients/PedidosCliente';
import {
    buscarClientesPorNome,
    buscarPedidosPorCliente,
    atualizarStatusPedido,
    enviarPedido,
} from "../../api/clienteapi";

import { Modal } from "react-bootstrap";
import { format } from "date-fns";

import Filter from '../../components/filter/filter';
import ClientePedidoTable from './ClientePedidoTable';
import { api } from "../../components/api/api";

function TelaPedido() {
    const [clienteNome, setClienteNome] = useState("");
    const [clientes, setClientes] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const [descontoPercentual, setDescontoPercentual] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [mensagem, setMensagem] = useState("");
    const [produtosAdicionados, setProdutosAdicionados] = useState([]);
    const [userData, setUserData] = useState([]);
    const [observacao, setObservacao] = useState(""); // Novo estado para observação
    //NOVO
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [showModalNovoProduto, setShowModalNovoProduto] = useState(false);
    const [showModalHistorico, setShowModalHistorico] = useState(false);
    const [historico, setHistorico] = useState([]);

    const fetchClientes = (query, dtInicio, dtFim) => {
        try {
            api.get(`api/Cliente/BuscarClientes?q=${query ? query : ""}&dtInicio=${dtInicio ? dtInicio : ""}&dtFim=${dtFim ? dtFim : ""}&valores=true`, res => {
                setClientes(res.data);
            })
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    const BuscarTodosProdutos = () => {
        api.get("/api/Produto/BuscarTodos", res => {
            setProdutos(res.data);
        }, erro => {
            alert(erro.mensage)
        })
    }

    useEffect(() => {
        // const dataUserString = localStorage.getItem("dataUser");
        // if (!dataUserString) {
        //     window.location.href = "/login";
        //     return;
        // }
        // const dataUser = JSON.parse(dataUserString);
        // setUserData(dataUser);
        BuscarTodosProdutos();
        fetchClientes();
    }, []);

    const handleAbrirModal = (cliente) => {
        setClienteSelecionado(cliente);
        setShowModalNovoProduto(true);
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        fetchClientes(value, dataInicio, dataFim);
        setClienteNome(value);
    };

    const handleBuscarPedidos = async (clienteId) => {
        try {
            const response = await buscarPedidosPorCliente(clienteId);
            setPedidos(response);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
        }
    };

    const CalcularValorMinimo = (desconto) => {
        if (/^\d*\.?\d*$/.test(desconto) || desconto === "") {
            const percentual = desconto === "" ? "" : parseFloat(desconto);
            if (percentual >= 0 && percentual <= 100) {
                let total = produtosAdicionados.reduce((acc, produto) => {
                    acc += produto.valorMinimo * produto.quantidade;
                    return acc;
                }, 0);

                let valorVenda = produtosAdicionados.reduce((acc, produto) => {
                    const totalProdutoSemDesconto = produto.valor * produto.quantidade;
                    const totalProdutoComDesconto =
                        totalProdutoSemDesconto - (produto.valorDesconto || 0);
                    return acc + totalProdutoComDesconto;
                }, 0);

                let valorDesconto = (valorVenda * percentual) / 100;
                let abaixo = (valorVenda - valorDesconto.toFixed(2)) < total;

                if (abaixo) {
                    alert(`Valor do pedido está a baixo que o valor minímo.
          Desconto permitido até o valor de R$ ${total}`);
                }

                return abaixo;
            }
        }
    }

    const handleEnviarPedido = async () => {
        if (!clienteSelecionado) {
            alert("Por favor, selecione um cliente.");
            return;
        }

        if (produtosAdicionados.length === 0) {
            alert("Por favor, selecione pelo menos um produto.");
            return;
        }

        if (CalcularValorMinimo(descontoPercentual)) {
            return;
        }

        const vt = calcularValorTotalPedido();
        const vs = calcularValorTotalSemDescontoPedido();
        const data = new FormData();
        const obj = JSON.stringify({
            ClienteId: clienteSelecionado.id,
            ProdutosAdicionado: produtosAdicionados,
            VendedorUsuarioId: 1, //userData.
            ValorTotal: vt,
            ValorDesconto: vs - vt,
            PercentualDesconto: descontoPercentual,
            Observacao: observacao,
        });
        data.append("obj", obj);
        try {
            api.post("api/Pedido/NovoPedido", data, res => {
                alert("Pedido enviado com sucesso!");
                setClienteNome("");
                setClienteSelecionado(null);
                setProdutoSelecionado(null);
                setQuantidade(1);
                setValorTotal(0);
                setObservacao("");
            }, erro => {
                alert("Houve um erro na solicitação!\nPor favor tente novamente mais tarde.");
            })

        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
        }
    };

    const handleQuantidadeChange = (event) => {
        const newQuantidade = parseInt(event.target.value);
        setQuantidade(newQuantidade);
        if (produtoSelecionado) {
            setValorTotal(produtoSelecionado.valor * newQuantidade);
        }
    };

    const adicionarProduto = () => {
        if (produtoSelecionado) {
            const produtoExistente = produtosAdicionados.find(
                (p) => p.id === produtoSelecionado.id
            );
            const novaQuantidade = parseInt(quantidade);

            if (produtoExistente) {
                const updatedProdutosAdicionados = produtosAdicionados.map((p) =>
                    p.id === produtoExistente.id
                        ? { ...p, quantidade: p.quantidade + novaQuantidade }
                        : p
                );
                setProdutosAdicionados(updatedProdutosAdicionados);
            } else {
                setProdutosAdicionados([
                    ...produtosAdicionados,
                    { ...produtoSelecionado, quantidade: novaQuantidade, valorDescontoUnitario: 0 },
                ]);
            }

            const e = document.getElementById('produtos');
            e.value = "";
            setProdutoSelecionado(null);
            setQuantidade(1);
        }
    };

    const removerProduto = (produtoRemovido) => {
        const novosProdutosAdicionados = produtosAdicionados.filter(
            (produto) => produto.id !== produtoRemovido.id
        );
        setProdutosAdicionados(novosProdutosAdicionados);
    };

    const calcularValorTotalPedido = () => {
        let total = produtosAdicionados.reduce((acc, produto) => {
            const totalProdutoSemDesconto = produto.valor * produto.quantidade;
            // Aqui é aplicado o desconto em reais para cada produto
            const totalProdutoComDesconto =
                totalProdutoSemDesconto - (produto.valorDesconto || 0);
            return acc + totalProdutoComDesconto;
        }, 0);

        // Aqui é aplicado o desconto percentual ao total do pedido
        const descontoPercentualValor = (total * descontoPercentual) / 100;
        total -= descontoPercentualValor;

        // Retorna o valor total formatado com duas casas decimais
        return total.toFixed(2);
    };

    const calcularValorTotalSemDescontoPedido = () => {
        let total = produtosAdicionados.reduce((acc, produto) => {
            const totalProdutoSemDesconto = produto.valor * produto.quantidade;
            // Aqui é aplicado o desconto em reais para cada produto
            return acc + totalProdutoSemDesconto;
        }, 0);

        return total.toFixed(2);
    };

    const handleDescontoPercentualChange = (event) => {
        const inputValue = event.target.value;
        if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
            const percentual = inputValue === "" ? "" : parseFloat(inputValue);
            if (percentual >= 0 && percentual <= 100) {
                setDescontoPercentual(percentual);
            }
        }
    };

    const handleDescontoReaisChange = (produtoId, event) => {
<<<<<<< HEAD
       
=======
>>>>>>> 3da1f209515417a6b63906e637dc9f804a79da56
        const valorDescontoReais = parseFloat(event.target.value);
        if (!isNaN(valorDescontoReais)) {
            // Atualiza o desconto em reais do produto específico
            const updatedProdutosAdicionados = produtosAdicionados.map((produto) => {
                if (produto.id === produtoId) {
                    return { ...produto, valorDesconto: valorDescontoReais, valorDescontoUnitario: valorDescontoReais };
                }
                return produto;
            });
            setProdutosAdicionados(updatedProdutosAdicionados);
        }
    };

    const ShowModalHistoricoPedidos = (cliente) => {
        setClienteSelecionado(cliente);
        api.get(`api/pedidos/cliente/${cliente.id}`, res => {
            setHistorico(res.data);
            setShowModalHistorico(true);
        }, err => {
            alert("Houve um erro na solicitação.")
        })
    }

    return (
        <div>
            <ModalNovoPedido
                CalcularValorMinimo={CalcularValorMinimo}
                modalAberto={showModalNovoProduto}
                setModal={setShowModalNovoProduto}
                produtos={produtos}
                setProdutoSelecionado={setProdutoSelecionado}
                clienteSelecionado={clienteSelecionado}
                quantidade={quantidade}
                handleQuantidadeChange={handleQuantidadeChange}
                produtoSelecionado={produtoSelecionado}
                adicionarProduto={adicionarProduto}
                produtosAdicionados={produtosAdicionados}
                handleDescontoReaisChange={handleDescontoReaisChange}
                removerProduto={removerProduto}
                descontoPercentual={descontoPercentual}
                handleDescontoPercentualChange={handleDescontoPercentualChange}
                calcularValorTotalPedido={calcularValorTotalPedido}
                observacao={observacao}
                setObservacao={setObservacao}
                handleEnviarPedido={handleEnviarPedido}
                mensagem={mensagem}
            />
            <ModalPedidosCliente
                clienteSelecionado={clienteSelecionado}
                show={showModalHistorico}
                close={setShowModalHistorico}
                handdleNovoPedido={handleAbrirModal}
                produtos={historico}
            />
            <div className="App">
                <div className="content">
                    <h1>Pedidos Por Clientes</h1>
                    <Filter
                        filtroNome={clienteNome}
                        handleInputChange={handleInputChange}
                        handleAbrirModal={handleAbrirModal}
                        setDataInicio={setDataInicio}
                        setDataFim={setDataFim}
                        fetchClientes={fetchClientes}
                        dataInicio={dataInicio}
                        dataFim={dataFim}
                        showNovoCliente={true}
                    />
                    <ClientePedidoTable
                        ShowModalHistoricoPedidos={ShowModalHistoricoPedidos}
                        clientes={clientes}
                        handleAbrirModal={handleAbrirModal}
                        handleBuscarPedidos={handleBuscarPedidos}
                    />
                </div>
            </div>
        </div>
    );
}

export default TelaPedido;
