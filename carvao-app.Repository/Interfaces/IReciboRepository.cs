using carvao_app.Repository.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Interfaces
{
    public interface IReciboRepository
    {
        object BuscarRecibosId(int pedidoId);
        int GerarRecibo(GerarReciboRequestRepository recibo);
    }
}
