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

            string QueryUpdate = "Update recibo Set justificativa = @justificativa, ativo = 0 where recibo_id = @Id";
            var param = new DynamicParameters();
            param.Add("@justificativa", mensagem);
            param.Add("@Id", reciboId);
            DataBase.Execute(_configuration, QueryUpdate, param);

            param = new DynamicParameters();
            param.Add("@Saldo", recibo.valor_pago);
            DataBase.Execute(_configuration, "UPDATE pedido set saldo_devedor = saldo_devedor + @Saldo", param);

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
                param.Add("@NomePagador",  reciboMap.nome_pagador);
                param.Add("@Observacoes", reciboMap.observacoes);
                param.Add("@HashRecibo", reciboMap.hash_recibo);
                DataBase.Execute(_configuration, QueryInsert, param);


                int id = DataBase.Execute<int>(_configuration, QueryInsert, param).FirstOrDefault();
                return id;

            }
            catch (Exception)
            {
                throw;
            }


        }

    }
}
