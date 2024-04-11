using carvao_app.Business.Interfaces;
using carvao_app.Models.Requests;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Services
{
    public class ReciboService : IRecibo
    {
        private readonly IReciboRepository _repository;

        public ReciboService(IReciboRepository repository)
        {
            _repository = repository;
        }

        public object BuscarRecibosId(int pedidoId)
        {
            return _repository.BuscarRecibosId(pedidoId);
        }

        public int GerarRecibo(GerarReciboRequest recibo)
        {
            try
            {
                var map = new GerarReciboRequestRepository
                {
                    FormaPagamento = recibo.FormaPagamento,
                    Id = recibo.Id,
                    NomePagador = recibo.NomePagador,
                    Observacao = recibo.Observacao,
                    ValorPagar = recibo.ValorPagar
                };

                return _repository.GerarRecibo(map);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
