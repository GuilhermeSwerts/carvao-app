using carvao_app.Models.Enum;
using carvao_app.Repository.Conexao;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using Dapper;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using Mysqlx.Crud;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Services
{
    public class ReciboRepository : IReciboRepository
    {
        private readonly IConfiguration _configuration;
        private readonly IPedidoRepository _pedidoRepository;

        public ReciboRepository(IConfiguration configuration, IPedidoRepository pedidoRepository)
        {
            _configuration = configuration;
            _pedidoRepository = pedidoRepository;
        }

        public object BuscarRecibosId(int pedidoId)
        {
            return DataBase.Execute<ReciboMap>(_configuration, "SELECT * FROM recibo WHERE pedido_id = @Id And ativo = 1", new { Id = pedidoId }).ToList();
        }

        public object BuscarReciboPorId(int reciboId)
        {
            return DataBase.Execute<ReciboMap>(_configuration, "SELECT * FROM recibo WHERE recibo_id = @Id", new { Id = reciboId }).FirstOrDefault();
        }


        public object CancelarReciboPorId(int reciboId, string mensagem)
        {
            var recibo = DataBase.Execute<ReciboMap>(_configuration, "SELECT * FROM recibo WHERE recibo_id = @Id And ativo = 1", new { Id = reciboId }).FirstOrDefault();

            var pedido = DataBase.Execute<PedidoMap>(_configuration, "SELECT * FROM pedido WHERE pedido_id = @Id", new { Id = recibo.pedido_id }).FirstOrDefault();

            string QueryUpdate = "Update recibo Set justificativa = @justificativa, ativo = 0 where recibo_id = @Id";
            var param = new DynamicParameters();
            param.Add("@justificativa", mensagem);
            param.Add("@Id", reciboId);
            DataBase.Execute(_configuration, QueryUpdate, param);

            if ((pedido.Saldo_devedor + recibo.valor_pago) <= pedido.Valor_total)
            {
                param = new DynamicParameters();
                param.Add("@Saldo", recibo.valor_pago);
                DataBase.Execute(_configuration, "UPDATE pedido set saldo_devedor = saldo_devedor + @Saldo", param);
            }

            return 0;
        }

        public int GerarRecibo(GerarReciboRequestRepository recibo)
        {
            try
            {

                var reciboMap = new ReciboMap
                {
                    data_recibo = DateTime.Now,
                    forma_pagamento = recibo.FormaPagamento,
                    nome_pagador = recibo.NomePagador,
                    observacoes = recibo.Observacao,
                    pedido_id = recibo.Id,
                    valor_pago = recibo.ValorPagar,
                    hash_recibo = recibo.HashRecibo,
                };

                string QueryInsert = @"INSERT INTO recibo (pedido_id, data_recibo, valor_pago, forma_pagamento, nome_pagador, observacoes, hash_recibo)
                                    VALUES (@PedidoId, @DataRecibo, @ValorPago, @FormaPagamento, @NomePagador, @Observacoes, @HashRecibo);
                                    SELECT LAST_INSERT_ID();";
                var param = new DynamicParameters();
                param.Add("@PedidoId", reciboMap.pedido_id);
                param.Add("@DataRecibo", reciboMap.data_recibo);
                param.Add("@ValorPago", reciboMap.valor_pago);
                param.Add("@FormaPagamento", reciboMap.forma_pagamento);
                param.Add("@NomePagador", reciboMap.nome_pagador);
                param.Add("@Observacoes", reciboMap.observacoes);
                param.Add("@HashRecibo", reciboMap.hash_recibo);

                int id = DataBase.Execute<int>(_configuration, QueryInsert, param).FirstOrDefault();

                //AtualizarStatusPagamento(recibo.Id, StatusPagamentoEnum.Concluido);

                return id;
                

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //private void AtualizarStatusPagamento(int pedidoId, StatusPagamentoEnum status)
        //{
        //    try
        //    {
        //        var pedido = _pedidoRepository.BuscarPedidoId(pedidoId);

        //        if (pedido != null)
        //        {
        //            if (pedido.Status_pedido_id != (int)status)
        //            {
        //                pedido.Status_pedido_id = (int)status;

        //                Chamando o método corretamente

        //                _pedidoRepository.AtualizartSatusPagamento(pedido);

        //            }
        //        }
        //        else
        //        {
        //            throw new Exception("Pedido não encontrado.");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception("Erro ao atualizar o status do pagamento: " + ex.Message);
        //    }
        //}


    }
}
