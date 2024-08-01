import React, { useState, useEffect } from "react";
import ModalNovoPedido from '../../components/Modals/Clients/NovoPedido';
import ModalPedidosCliente from '../../components/Modals/Clients/PedidosCliente';
import {
    buscarPedidosPorCliente,
} from "../../api/clienteapi";

import { Modal } from "react-bootstrap";
import { format } from "date-fns";

import Filter from '../../components/filter/filter';
import ClientePedidoTable from './ClientePedidoTable';
import { api } from "../../components/api/api";
import { FaShoppingCart } from "react-icons/fa";
import { Alert, Pergunta } from "../../util/Alertas";

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
    const [status, setStatus] = useState([]);

    const fetchClientes = (query, dtInicio, dtFim) => {
        try {
            api.get(`api/Cliente/BuscarClientes?q=${query ? query : ""}&dtInicio=${dtInicio ? dtInicio : ""}&dtFim=${dtFim ? dtFim : ""}&valores=true`, res => {
                setClientes(res.data);
                /* setStatus(res.data)*/
            })
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    const BuscarTodosProdutos = () => {
        api.get("/api/Produto/BuscarTodos", res => {
            setProdutos(res.data);
        }, erro => {
            Alert(erro.mensage, false)
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
                    Alert(`Valor do pedido está a baixo que o valor minímo.
                    Desconto permitido até o valor de R$ ${total}`, false, true);
                }

                return abaixo;
            }
        }
    }

    const handleEnviarPedido = async () => {
        if (!clienteSelecionado) {
            Alert("Por favor, selecione um cliente.", false, true);
            return;
        }

        if (produtosAdicionados.length === 0) {
            Alert("Por favor, selecione pelo menos um produto.", false, true);
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
            api.post("api/Pedido/NovoPedido", data, async res => {
                const loader = document.getElementById(`loadingpanel`);
                if (loader)
                    loader.style.display = 'none';

                Alert("Pedido enviado com sucesso!");
                setProdutoSelecionado(null);
                setQuantidade(1);
                setValorTotal(0);
                setObservacao("");
                setProdutosAdicionados([]);
                setDescontoPercentual(0);

                fetchClientes();

                var mesmoCliente = await Pergunta("Deseja realizar outro pedido para o mesmo cliente");

                if (!mesmoCliente) {
                    setClienteNome("");
                    setClienteSelecionado(null);
                    setProdutoSelecionado(null);
                    setShowModalNovoProduto(false);
                }
                fetchClientes();


            }, erro => {
                Alert("Houve um erro na solicitação!\nPor favor tente novamente mais tarde.", false);
            })

        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
        }
    };

    const handleQuantidadeChange = (event) => {
        const newQuantidade = parseInt(event.target.value);

        if (isNaN(newQuantidade)){
            setQuantidade('');
        };

        if ((produtoSelecionado.quantidade - newQuantidade) <= 0) {
            Alert(`Não há estoque suficiente, quantidade máxima do produto ${produtoSelecionado.nome} é de ${produtoSelecionado.quantidade}`, false, true);
            return;
        }

        const produtoExistente = produtosAdicionados.find(
            (p) => p.id === produtoSelecionado.id
        );

        if (produtoExistente) {
            let erro = false;
            let max = 0;
            produtosAdicionados.forEach((p) => {
                if (p.id === produtoExistente.id) {

                    console.clear();
                    console.log(produtosAdicionados)
                    console.log(produtoSelecionado)
                    console.log(newQuantidade)
                    max = produtoSelecionado.quantidade - p.quantidade;
                    erro = ((produtoSelecionado.quantidade - p.quantidade - newQuantidade) <= 0)
                }
            })

            if (erro) {
                Alert(`Não há estoque suficiente, quantidade máxima do produto ${produtoSelecionado.nome} é de ${max}`, false, true);
                return;
            }
        }

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

    const CalcularValorDescontoPorQuantidade = (produtoId, quantidade, valorDescontoDigitado) => {
        let produto = produtos.filter(x => x.id === produtoId)[0];

        let valorTotal = produto.valor * quantidade;
        let valorMinimo = produto.valorMinimo * quantidade;
        let valorMaximoDesconto = (valorTotal - valorMinimo);

        if (valorMaximoDesconto < valorDescontoDigitado) {
            Alert(`Valor do pedido está a baixo que o valor minímo.
                Desconto permitido até o valor de R$ ${valorMaximoDesconto}`, false, true);
            return true;
        }

        return false;
    }

    const handleDescontoReaisChange = (produtoId, quantidade, event) => {
        try {
            const valor = event.target.value.replace(/[^0-9,.]/g, '').replace(',', '.');
            if (valor.includes('.') && (valor.split('.').length === 1 || valor.split('.').length > 1 && valor.split('.')[1] === '')) {
                const produtoSemValidacao = produtosAdicionados.map((produto) => {
                    if (produto.id === produtoId) {
                        return { ...produto, valorDesconto: valor };
                    }
                    return produto;
                });
                setProdutosAdicionados(produtoSemValidacao);
                return;
            }

            const valorDescontoReais = valor === '' ? 0 : parseFloat(valor);

            if (CalcularValorDescontoPorQuantidade(produtoId, quantidade, valorDescontoReais)) {
                return;
            }
            debugger
            if (!isNaN(valorDescontoReais)) {
                const updatedProdutosAdicionados = produtosAdicionados.map((produto) => {
                    if (produto.id === produtoId) {
                        return { ...produto, valorDesconto: valorDescontoReais };
                    }
                    return produto;
                });
                setProdutosAdicionados(updatedProdutosAdicionados);
            } else {
                Alert('Valor digitado esta incorreto!', false, true);
            }
        } catch (error) {
            Alert('Valor digitado esta incorreto!', false, true);
        }
    };


    const ShowModalHistoricoPedidos = (cliente) => {
        console.log({ cliente })
        setClienteSelecionado(cliente);
        debugger
        api.get(`api/pedidos/cliente/${cliente.id}`, res => {
            setHistorico(res.data);
            setShowModalHistorico(true);
        }, err => {
            alert("Houve um erro na solicitação.")
        })
    }

    // const handleatualizarstatuspedido = async (pedidoid, novostatus) => {
    //     try {
    //         // chama a função para atualizar o status do pedido
    //         await atualizarstatuspedido({ pedidoid, novostatus });
    //         alert('status do pedido atualizado com sucesso!');
    //         // adicione qualquer lógica adicional aqui, se necessário
    //     } catch (error) {
    //         console.error('erro ao atualizar o status do pedido:', error);
    //         alert('ocorreu um erro ao atualizar o status do pedido. por favor, tente novamente.');
    //     }
    // };

    const closeModalNovoPedido = () => {
        setProdutoSelecionado(null);
        setQuantidade(1);
        setValorTotal(0);
        setObservacao("");
        setProdutosAdicionados([]);
        setClienteNome("");
        setClienteSelecionado(null);
        setProdutoSelecionado(null);
        setShowModalNovoProduto(false);
    }

    return (
        <div>
            <ModalNovoPedido
                CalcularValorMinimo={CalcularValorMinimo}
                modalAberto={showModalNovoProduto}
                setModal={setShowModalNovoProduto}
                closeModalNovoPedido={closeModalNovoPedido}
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
                    <Filter
                        filtroNome={clienteNome}
                        handleInputChange={handleInputChange}
                        handleAbrirModal={() => window.location.href = '/cliente'}
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
