using carvao_app.Business.Interfaces;
using carvao_app.Models.Requests;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Services;
using System;
using System.Security.Cryptography;
using System.Text;

namespace carvao_app.Business.Services
{
    public class ReciboService : IRecibo
    {
        private readonly IReciboRepository _repository;
        private readonly IPedidosService _pedidosService;

        public ReciboService(IReciboRepository repository, IPedidosService pedidosService)
        {
            _repository = repository;
            _pedidosService = pedidosService;
        }

        public object BuscarReciboPorId(int reciboId)
        {
            return _repository.BuscarReciboPorId(reciboId);
        }

        public object BuscarRecibosId(int pedidoId)
        {
            return _repository.BuscarRecibosId(pedidoId);
        }

        public int CancelarReciboPorId(int reciboId, string menssagem)
        {
            var result = _repository.CancelarReciboPorId(reciboId, menssagem);
            return 1;
        }

        public int GerarRecibo(GerarReciboRequest recibo)
        {

            try
            {
                if (_pedidosService.AtualizarSaldoDevedor(recibo.Id, recibo.valor_pago))
                {

                    string hashRecibo = GenerarHash(recibo);
                    var map = new GerarReciboRequestRepository
                    {
                        FormaPagamento = recibo.forma_pagamento,
                        Id = recibo.Id,
                        NomePagador = recibo.nome_pagador,
                        Observacao = recibo.observacoes,
                        ValorPagar = recibo.valor_pago,
                        HashRecibo = hashRecibo,

                    };

                    recibo.hash_recibo = hashRecibo;
                    int reciboId = _repository.GerarRecibo(map);

                    return reciboId;
                }
                return 0;
            }
            catch (Exception)
            {
                throw;
            }

        }

        private string GenerarHash(GerarReciboRequest recibo)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                string hashInput = $"{recibo.forma_pagamento}-{recibo.Id}-{recibo.nome_pagador}-{recibo.observacoes}-{recibo.valor_pago}-{Guid.NewGuid}";
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(hashInput));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }

}
