using carvao_app.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Interfaces
{
    public interface IRecibo
    {
        object BuscarRecibosId(int pedidoId);
        int GerarRecibo(GerarReciboRequest recibo);

        int CancelarReciboPorId(int reciboId, string menssagem);
    }
}
