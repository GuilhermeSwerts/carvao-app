using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using System.Collections.Generic;

namespace carvao_app.Business.Interfaces
{
    public interface IClientesService
    {
        List<ClienteDto> BuscarClientes(string q, string dtInicio, string dtFim, bool valores);
        ClienteDto BuscarClientesId(int id);
        void NovoCliente(ClienteRequest request);
        void AtualizaDadosCliente(ClienteRequest request);
        void AlterarStatusCliente(int id, bool status);
    }
}
