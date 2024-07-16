using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Interfaces
{
    public interface IUsuarioRepository
    {
        void NovoUsuarios(UsuarioMap usuarioMap);
        object BuscarTiposUsuarios();
        UsuarioMap Login(string cpf, string senha);
        List<UsuarioMap> BuscarTodosUsuarios();
        void AlterarStatusUsuario(int usuarioId, int status);
        void AtualizarUsuario(UsuarioMap usuarioMap);
        UsuarioMap BuscarUsuarioById(int usuarioId);
        void ResetaSenhaUsuario(int id, string senha);
    }
}
