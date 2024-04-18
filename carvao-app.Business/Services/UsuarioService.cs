using carvao_app.Business.Interfaces;
using carvao_app.Helper;
using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Services
{
    public class UsuarioService : IUsuario
    {
        private readonly IUsuarioRepository _repository;

        public UsuarioService(IUsuarioRepository repository)
        {
            _repository = repository;
        }

        public void BuscarNovoUsuarios(NovoUsuarioRequest request)
        {
            try
            {
                _repository.BuscarNovoUsuarios(new UsuarioMap
                {
                    Cpf = request.Cpf,
                    Data_cadastro = DateTime.Now,
                    Email = request.Email,
                    Habilitado = true,
                    Nome = request.Nome,
                    Tipo_usuario_id = request.Tipo,
                    Senha = Cripto.Encrypt("P@drao123")
                });
            }
            catch (Exception)
            {
                throw;
            }
        }

        public object BuscarTiposUsuarios()
        {
            return _repository.BuscarTiposUsuarios();
        }

        public UsuarioDto Login(string cpf, string senha)
        {
            try
            {
                var usuario = _repository.Login(cpf, senha);
                return new UsuarioDto
                {
                    TipoUsuario = usuario.Tipo_usuario_id,
                    UsuarioId = usuario.Usuario_id
                };
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
