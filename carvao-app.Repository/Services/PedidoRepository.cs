using carvao_app.Models.Enum;
using carvao_app.Repository.Conexao;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using carvao_app.Repository.Request;
using Dapper;
using carvao_app.Models.Enum; 
using Microsoft.Extensions.Configuration;
using MySqlX.XDevAPI;
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


        public bool AtualizarStatusPedido(int pedidoId, int statusPedido)
        {
            var pedido = DataBase.Execute<PedidoMap>(_configuration, "SELECT * FROM pedido WHERE pedido_id = @Id", new { Id = pedidoId }).FirstOrDefault();

            if (pedido != null)
            {
                var param = new DynamicParameters();
                param.Add("@Id", pedidoId);
                param.Add("@Status_pedido_id", statusPedido);

                var query = "UPDATE pedido SET status_pedido_id = @Status_pedido_id WHERE pedido_id = @Id";

                DataBase.Execute(_configuration, query, param);

                return true;
            }
            else
            {
                return false;
            }
        }

        public bool AtualizarSaldoDevedor(int pedidoId, decimal valorPago)
        {
            var pedido = DataBase.Execute<PedidoMap>(_configuration, "SELECT * FROM pedido WHERE pedido_id = @Id", new { Id = pedidoId }).FirstOrDefault();
            
            if (pedido != null)
            {
                if (valorPago > pedido.Saldo_devedor)
                {
                    return false;
                }

                pedido.Saldo_devedor = pedido.Saldo_devedor - valorPago;

                var param = new DynamicParameters();
                param.Add("@Id", pedido.Pedido_id);
                param.Add("@SaldoDevedor", pedido.Saldo_devedor);
                

                var query = " ";
                if (pedido.Saldo_devedor == 0)
                {
                    param.Add("@status_pagamento_id", StatusPagamentoEnum.Concluido);
                    query = @"
                        UPDATE pedido
                        SET
                            data_atualizacao = NOW(),
                            saldo_devedor = @SaldoDevedor,
                            status_pagamento_id = @status_pagamento_id
                        WHERE pedido_id = @Id;
                        ";
                }
                else
                {
                    param.Add("@status_pagamento_id", StatusPagamentoEnum.Parcial);
                    query = @"
                        UPDATE pedido
                        SET
                            data_atualizacao = NOW(),
                            saldo_devedor = @SaldoDevedor,
                            status_pagamento_id = @status_pagamento_id
                        WHERE pedido_id = @Id;
                        ";

                }


                DataBase.Execute(_configuration, query, param);
            }

            return true;
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

        public List<PedidoMap> BuscarTodosPedidos(string q, string dtInicio, string dtFim,UsuarioMap usuarioMap)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Nome", $"%{q}%");

            var query = @"
                        SELECT 
                            c.nome AS NomeCliente, 
                            u.nome AS NomeVendedor, 
                            p.pedido_id, 
                            p.vendedorusuarioid, 
                            p.atendenteusuarioid, 
                            p.cliente_id, 
                            p.valor_total, 
                            p.valor_desconto, 
                            p.percentual_desconto, 
                            p.status_pedido_id, 
                            p.data_pedido, 
                            p.data_atendimento, 
                            p.data_atualizacao, 
                            p.observacao, 
                            p.status_pagamento_id, 
                            CONCAT(COALESCE(e.localidade, ''), ' - ', COALESCE(e.uf, '')) AS Localidade, 
                            p.saldo_devedor 
                        FROM pedido p 
                        JOIN cliente c ON p.cliente_id = c.cliente_id 
                        JOIN usuario u ON p.vendedorusuarioid = u.usuario_id 
                        LEFT JOIN endereco e ON c.cliente_id = e.cliente_id 
                        WHERE c.nome LIKE @Nome
                    ";
            if (!string.IsNullOrEmpty(dtInicio) && !string.IsNullOrEmpty(dtFim))
            {
                query += " AND p.data_pedido BETWEEN @DataInicio AND @DataFim";
                parameters.Add("@DataInicio", dtInicio + " 00:00:00");
                parameters.Add("@DataFim", dtFim + " 23:59:59");
            }

            if ((int)ETipoUsuario.Vendedor == usuarioMap.Tipo_usuario_id)
            {
                parameters.Add("@Id", usuarioMap.Usuario_id);
                query += " AND p.vendedorusuarioid = @Id";
            }

            var pedidos = DataBase.Execute<PedidoMap>(_configuration, query, parameters).ToList();
            foreach (var pedido in pedidos)
            {
                pedido.Produtos = (_produtoRepository.BuscarProdutosByClienteId(pedido.Cliente_id))
                    .Where(x => x.Pedido_id == pedido.Pedido_id).ToList();
            }

            var pedidosOrganizados = pedidos.OrderBy(x => x.Status_pedido_id == 4).ToList();

            return pedidosOrganizados;
        }

        public List<StatusPagamentoMap> BuscarTodosStatusPagamento()
            => DataBase.Execute<StatusPagamentoMap>(_configuration, "SELECT * FROM status_pagamento", new { }).ToList();

        public List<StatusPedidoMap> BuscarTodosStatusPedido()
            => DataBase.Execute<StatusPedidoMap>(_configuration, "SELECT * FROM status_pedido", new { }).ToList();


        public void EditarPedido(EditarPedidoRequestDb map)
        {
            decimal valorPago = DataBase.Execute<decimal>(_configuration, "select COALESCE(SUM(valor_pago), 0) from recibo where pedido_id = @Id", new { Id = map.PedidoId }).FirstOrDefault();
            var valorTotal = RecuperarValorCom2CasaDecimais(map.ValorTotal);
            decimal novoSaldoDevedor = valorTotal - valorPago;

            var valorDesconto = RecuperarValorCom2CasaDecimais(map.ValorDesconto);

            var param = new DynamicParameters();
            param.Add("@Id", map.PedidoId);
            param.Add("@ValorTotal", valorTotal);
            param.Add("@ValorDesconto", valorDesconto);
            param.Add("@PercentualDesconto", map.PercentualDesconto);
            param.Add("@Observacao", map.Observacao);
            param.Add("@SaldoDevedor", novoSaldoDevedor);

            var query = @"
                        UPDATE pedido
                        SET
                            valor_total = @ValorTotal,
                            valor_desconto = @ValorDesconto,
                            percentual_desconto = @PercentualDesconto,
                            data_atualizacao = NOW(),
                            observacao = @Observacao,
                            saldo_devedor = @SaldoDevedor
                        WHERE pedido_id = @Id;
                        ";

            DataBase.Execute(_configuration, query, param);
            query = "delete from pedido_produto where pedido_id = @Id";
            param = new DynamicParameters();
            param.Add("@Id", map.PedidoId);
            DataBase.Execute(_configuration, query, param);

            foreach (var item in map.ProdutosAdicionado)
            {
                var newParam = new DynamicParameters();
                newParam.Add("@PedidoId", map.PedidoId);
                newParam.Add("@ProdutoId", item.Produto_id);
                newParam.Add("@Quantidade", item.Quantidade);
                newParam.Add("@ValorUnitario", item.Valor);
                newParam.Add("@ValorTotal", map.ValorTotal);
                newParam.Add("@ValorDesconto", map.ValorDesconto);
                newParam.Add("@DescontoUn", item.desconto_unitario);

                query = @"INSERT INTO pedido_produto
                (pedido_id, produto_id, quantidade, valor_unitario, valor_total, valor_desconto,desconto_unitario)
                VALUES(@PedidoId, @ProdutoId, @Quantidade, @ValorUnitario, @ValorTotal, @ValorDesconto,@DescontoUn);";

                DataBase.Execute(_configuration, query, newParam);
            }
        }

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
                newParam.Add("@DescontoUn", item.desconto_unitario);

                query = @"INSERT INTO pedido_produto
                (pedido_id, produto_id, quantidade, valor_unitario, valor_total, valor_desconto,desconto_unitario)
                VALUES(@PedidoId, @ProdutoId, @Quantidade, @ValorUnitario, @ValorTotal, @ValorDesconto,@DescontoUn);";

                DataBase.Execute(_configuration, query, newParam);
            }

        }

        private decimal RecuperarValorCom2CasaDecimais(string valor)
        {
            if (valor.Contains('.')) valor = valor.Replace(".", ",");
            else if (!valor.Contains(".") && !valor.Contains(",")) valor = valor + ",00";


            var numerosDepois = valor.Split(',')[0];
            var numerosAntes = valor.Split(',')[1];

            var novoValor = numerosDepois + "," + numerosAntes[..2];

            return decimal.Parse(novoValor);
        }
    }
}
