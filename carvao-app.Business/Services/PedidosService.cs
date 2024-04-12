﻿using carvao_app.Business.Interfaces;
using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using carvao_app.Repository.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Services
{
    public class PedidosService : IPedidosService
    {
        private readonly IPedidoRepository _repository;
        public PedidosService(IPedidoRepository repository)
        {
            _repository = repository;
        }

        public object BuscarPedidoId(int pedidoId)
        {
            var pedido = _repository.BuscarPedidoId(pedidoId);
            return pedido;
        }

        public PedidoDto BuscarTodosPedidos(string dtInicio, string dtFim)
        {
            var pedidos = _repository.BuscarTodosPedidos(dtInicio, dtFim);
            var stPagamento = _repository.BuscarTodosStatusPagamento();
            var stPedido = _repository.BuscarTodosStatusPedido();
            return new PedidoDto().ToDto(pedidos, stPagamento, stPedido);
        }

        public List<HistoricoDto> HistoricoPedidosCliente(int id)
        {
            var historico = _repository.HistoricoPedidosCliente(id);
            return new HistoricoDto().ToDtoList(historico);
        }

        public void NovoPedido(NovoProdutoRequest request)
        {
            var map = new NovoPedidoRequestDb
            {
                ClienteId = request.ClienteId,
                DataPedido = DateTime.Now,
                Observacao = request.Observacao,
                StatusPedidoId = 1,
                ValorDesconto = request.ValorDesconto,
                ValorTotal = request.ValorTotal,
                VendedorUsuarioId = request.VendedorUsuarioId,
                StatusPagamentoId = 1,
                PercentualDesconto = request.PercentualDesconto,
                ProdutosAdicionado = MapProdutosAdicionado(request.ProdutosAdicionado)
            };

            _repository.NovoPedido(map);
        }

        private List<ProdutoMap> MapProdutosAdicionado(List<ProdutoDto> produtosAdicionado)
        {
            var retorno = new List<ProdutoMap>();
            foreach (var item in produtosAdicionado)
            {
                retorno.Add(new ProdutoMap
                {
                    Produto_id = item.Id,
                    Nome = item.Nome,
                    Valor = item.Valor,
                    Valor_desconto_maximo = item.ValorMinimo,
                    Quantidade = item.Quantidade
                });
            }
            return retorno;
        }
    }
}
