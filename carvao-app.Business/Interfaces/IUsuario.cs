using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Interfaces
{
    public interface IUsuario
    {
        void BuscarNovoUsuarios(NovoUsuarioRequest request);
        object BuscarTiposUsuarios();
        UsuarioDto Login(string cpf, string senha);
    }
}
