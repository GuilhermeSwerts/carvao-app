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

        public void NovoUsuarios(NovoUsuarioRequest request)
        {
            try
            {
                _repository.NovoUsuarios(new UsuarioMap
                {
                    Cpf = request.Cpf,
                    Data_cadastro = DateTime.Now,
                    Email = request.Email,
                    Habilitado = 1,
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

        public object BuscarTodosUsuarios()
        {
            try
            {
                var usuario = _repository.BuscarTodosUsuarios();
                return usuario.Select(usr => new UsuarioDto
                {
                    UsuarioId = usr.Usuario_id,
                    TipoUsuario = usr.Tipo_usuario_id,
                    Nome = usr.Nome,
                    Email = usr.Email,
                    DataCadastro = usr.Data_cadastro,
                    Habilitado = usr.Habilitado,
                    Cpf = usr.Cpf,
                }).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void EditarUsuario(NovoUsuarioRequest request)
        {
            try
            {
                _repository.AtualizarUsuario(new UsuarioMap
                {
                    Usuario_id = request.Id ?? 0,
                    Cpf = request.Cpf,
                    Data_cadastro = DateTime.Now,
                    Email = request.Email,
                    Nome = request.Nome,
                    Tipo_usuario_id = request.Tipo
                });
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void AtualizarStatusUsuario(int usuarioId, int status)
        {
            _repository.AlterarStatusUsuario(usuarioId, status);
        }
    }
}
