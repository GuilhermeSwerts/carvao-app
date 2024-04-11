﻿using carvao_app.Repository.Conexao;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using carvao_app.Repository.Request;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace carvao_app.Repository.Services
{
    public class PedidoRepository : IPedidoRepository
    {
        private readonly IConfiguration _configuration;
        private readonly IProdutoRepository _produtoRepository;
        private readonly IClienteRepository _clienteRepository;
        public PedidoRepository(IConfiguration configuration, IProdutoRepository produtoRepository, IClienteRepository clienteRepository)
        {
            _configuration = configuration;
            _produtoRepository = produtoRepository;
            _clienteRepository = clienteRepository;
        }

        public BuscarPedidoMap BuscarPedidoId(int pedidoId)
        {
            var pedido = DataBase.Execute<PedidoMap>(_configuration, "SELECT * FROM pedido WHERE pedido_id = @Id", new { Id = pedidoId }).FirstOrDefault();
            ClienteMap cliente = null;

            if (pedido != null)
            {
                pedido.Produtos = _produtoRepository.BuscarProdutosByClienteId(pedido.Pedido_id);

                cliente = _clienteRepository.BuscarClientesId(pedido.Cliente_id);
                if (cliente != null)
                    cliente.Endereco = DataBase.Execute<EnderecoMap>(_configuration, "SELECT * FROM endereco WHERE cliente_id = @Id", new { Id = cliente.Cliente_id }).FirstOrDefault();
            }

            return new BuscarPedidoMap
            {
                Cliente = cliente,
                Pedido = pedido
            };
        }

        public List<PedidoMap> BuscarTodosPedidos(string q, string dtInicio, string dtFim)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Nome", $"%{q}%");

            var query = "select c.nome as NomeCliente,u.nome as NomeVendedor,p.pedido_id,p.vendedorusuarioid, p.atendenteusuarioid,\r\np.cliente_id, p.valor_total, \r\np.valor_desconto, p.percentual_desconto, p.status_pedido_id, p.data_pedido, \r\np.data_atendimento, p.data_atualizacao, p.observacao, p.status_pagamento_id, concat(e.localidade,' - ',e.uf) as Localidade,p.saldo_devedor\r\nfrom pedido p \r\nJOIN cliente c \r\n\ton p.cliente_id = c.cliente_id\r\njoin usuario u \r\n\ton p.vendedorusuarioid  = u.usuario_id \r\njoin endereco e \r\n\ton c.cliente_id  = e.cliente_id WHERE c.nome like @Nome";

            if (!string.IsNullOrEmpty(dtInicio) && !string.IsNullOrEmpty(dtFim))
            {
                query += " AND p.data_pedido BETWEEN @DataInicio AND @DataFim";
                parameters.Add("@DataInicio", dtInicio + " 00:00:00");
                parameters.Add("@DataFim", dtFim + " 23:59:59");
            }

            var pedidos = DataBase.Execute<PedidoMap>(_configuration, query, parameters).ToList();
            foreach (var pedido in pedidos)
            {
                pedido.Produtos = _produtoRepository.BuscarProdutosByClienteId(pedido.Cliente_id);
            }
            return pedidos;
        }

        public List<StatusPagamentoMap> BuscarTodosStatusPagamento()
            => DataBase.Execute<StatusPagamentoMap>(_configuration, "SELECT * FROM status_pagamento", new { }).ToList();

        public List<StatusPedidoMap> BuscarTodosStatusPedido()
            => DataBase.Execute<StatusPedidoMap>(_configuration, "SELECT * FROM status_pedido", new { }).ToList();

        public List<HistoricoMap> HistoricoPedidosCliente(int id)
        {
            var param = new DynamicParameters();
            param.Add("@Id", id);

            var query = @"select 
	                      pedido_id as Id,
	                      valor_total as ValorTotal,
	                      data_pedido as DataPedido,
	                      sp.nome as StatusPedido,
	                      sp2.nome as StatusPagamento
                          from pedido pd
                          join status_pedido sp
                          	on pd.status_pedido_id = sp.status_pedido_id 
                          join status_pagamento sp2
                          	on pd.status_pagamento_id = sp2.status_pagamento_id
                          where pd.cliente_id = @Id";

            var hsitorico = DataBase.Execute<HistoricoMap>(_configuration, query, param).ToList();
            return hsitorico;
        }

        public void NovoPedido(NovoPedidoRequestDb map)
        {
            var param = new DynamicParameters();

            param.Add("@VendedorId", map.VendedorUsuarioId);
            param.Add("@ClienteId", map.ClienteId);
            param.Add("@ValorTotal", map.ValorTotal);
            param.Add("@ValorDesconto", map.ValorDesconto);
            param.Add("@PercentualDesconto", map.PercentualDesconto);
            param.Add("@StatusPedido", map.StatusPedidoId);
            param.Add("@StatusPagamento", map.StatusPagamentoId);
            param.Add("@Observacao", map.Observacao);

            var query = @"INSERT INTO pedido
                (vendedorusuarioid, cliente_id, valor_total, valor_desconto, percentual_desconto, status_pedido_id, data_pedido, observacao, status_pagamento_id,saldo_devedor)
                VALUES(@VendedorId, @ClienteId, @ValorTotal, @ValorDesconto, @PercentualDesconto, @StatusPedido, now(), @Observacao, @StatusPagamento,@ValorTotal);
            SELECT LAST_INSERT_ID();
            ";

            var pedidoId = DataBase.Execute<int>(_configuration, query, param).FirstOrDefault();

            foreach (var item in map.ProdutosAdicionado)
            {
                var newParam = new DynamicParameters();
                newParam.Add("@PedidoId", pedidoId);
                newParam.Add("@ProdutoId", item.Produto_id);
                newParam.Add("@Quantidade", item.Quantidade);
                newParam.Add("@ValorUnitario", item.Valor);
                newParam.Add("@ValorTotal", map.ValorTotal);
                newParam.Add("@ValorDesconto", map.ValorDesconto);

                query = @"INSERT INTO pedido_produto
                (pedido_id, produto_id, quantidade, valor_unitario, valor_total, valor_desconto)
                VALUES(@PedidoId, @ProdutoId, @Quantidade, @ValorUnitario, @ValorTotal, @ValorDesconto);";

                DataBase.Execute(_configuration, query, newParam);
            }

        }
    }
}
