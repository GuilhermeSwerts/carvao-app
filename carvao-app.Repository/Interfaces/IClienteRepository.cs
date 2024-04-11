using carvao_app.Repository.Maps;
using System.Collections.Generic;

namespace carvao_app.Repository.Interfaces
{
    public interface IClienteRepository
    {
        List<ClienteMap> BuscarClientes(string q, string dtInicio, string dtFim, bool valores);
        ClienteMap BuscarClientesId(int id);
        void InserirCliente(ClienteMap request);
        void AtualizaDadosCliente(ClienteMap request);
        void AlterarStatusCliente(int id, bool status);
        bool ExistCliente(ClienteMap cliente);
    }
}
