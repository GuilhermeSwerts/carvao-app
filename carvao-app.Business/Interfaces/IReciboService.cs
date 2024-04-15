using carvao_app.Models.Requests;

namespace carvao_app.Business.Interfaces
{
    public interface IRecibo
    {
        object BuscarRecibosId(int pedidoId);
        int GerarRecibo(GerarReciboRequest recibo);

        int CancelarReciboPorId(int reciboId, string menssagem);
        object BuscarReciboPorId(int reciboId);
    }
}
