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
        void NovoUsuarios(NovoUsuarioRequest request);
        object BuscarTiposUsuarios();
        UsuarioDto Login(string cpf, string senha);
        object BuscarTodosUsuarios(bool retornarSenha = false);
        void EditarUsuario(NovoUsuarioRequest request);
        void AtualizarStatusUsuario(int status, int status1);
        void ResetaSenhaUsuario(int id);
        void TrocaSenhaUsuario(string senhaAtual, string senhaNova, UsuarioMap usuarioMap);
        void EmailEsqueciSenha(string cpf, string email,string ip);
        void EsqueciSenha(EsqueciSenha request);
        object BuscarVendedores(DateTime dataInicio, DateTime dataFim);
    }
}
