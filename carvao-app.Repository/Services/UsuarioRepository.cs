using carvao_app.Repository.Conexao;
using carvao_app.Repository.Enum;
using carvao_app.Repository.Helper;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace carvao_app.Repository.Services
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly IConfiguration _configuration;

        public UsuarioRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void NovoUsuarios(UsuarioMap usuarioMap)
        {
            usuarioMap.Cpf = usuarioMap.Cpf.Replace("-", "").Replace(".", "");
            var exist = DataBase.Execute<UsuarioMap>(_configuration, "select * from usuario where cpf = @Cpf", new
            {
                usuarioMap.Cpf
            }).FirstOrDefault();
            if (exist != null)
            {
                if (exist.Habilitado == (int)ESituacaoUsuario.Inativo)
                {
                    throw new Exception("Usuário já existente com status inativo\nAtualiza a situação no grid de usuários\nPara ativar o usuário.");
                }
                else if (exist.Habilitado == (int)ESituacaoUsuario.Deletado)
                {
                    var p = new DynamicParameters();
                    p.Add("@Nome", usuarioMap.Nome);
                    p.Add("@Email", usuarioMap.Email);
                    p.Add("@Senha", usuarioMap.Senha);
                    p.Add("@Data", usuarioMap.Data_cadastro);
                    p.Add("@Tipo", usuarioMap.Tipo_usuario_id);
                    p.Add("@Id", exist.Usuario_id);
                    var sql = @"UPDATE usuario SET nome = @Nome, 
                                                   email = @Email,
                                                   senha = @Senha,
                                                   tipo_usuario_id = @Tipo,
                                                   habilitado = 1
                                WHERE usuario_id = @Id";
                    DataBase.Execute(_configuration, sql, p);
                    return;
                }
                else
                {
                    throw new Exception("Usuário já existente.");
                }
            };

            var parameters = new DynamicParameters();
            parameters.Add("@Nome", usuarioMap.Nome);
            parameters.Add("@Email", usuarioMap.Email);
            parameters.Add("@Senha", usuarioMap.Senha);
            parameters.Add("@Data", usuarioMap.Data_cadastro);
            parameters.Add("@Tipo", usuarioMap.Tipo_usuario_id);
            parameters.Add("@Cpf", usuarioMap.Cpf);

            var query = @"INSERT INTO usuario
            (nome, email, senha, data_cadastro, tipo_usuario_id, habilitado, cpf)
            VALUES(@Nome, @Email, @Senha, @Data, @Tipo, 1, @Cpf)";
            DataBase.Execute(_configuration, query, parameters);
        }

        public object BuscarTiposUsuarios()
        {
            return DataBase.Execute<TipoUsuarioMap>(_configuration, "select * from tipo_usuario", new()).ToList();
        }

        public UsuarioMap Login(string cpf, string senha)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Cpf", cpf.Replace(".", "").Replace("-", ""));

            var query = "select * from usuario WHERE cpf = @Cpf";

            var usuario = DataBase.Execute<UsuarioMap>(_configuration, query, parameters).FirstOrDefault()
                ?? throw new Exception("Usuário ou senha inválido.");

            if (usuario.Habilitado == (int)ESituacaoUsuario.Inativo)
            {
                throw new Exception("Usuário inativo.");
            }

            if (usuario.Habilitado == (int)ESituacaoUsuario.Deletado)
            {
                throw new Exception("Usuário não encontrado.");
            }

            if (Cripto.Decrypt(usuario.Senha) != senha)
                throw new Exception("senha inválida.");

            return usuario;
        }

        public List<UsuarioMap> BuscarTodosUsuarios()
        {
            var parameters = new DynamicParameters();
            var query = "SELECT * FROM usuario WHERE habilitado <> 2";
            var usuarios = DataBase.Execute<UsuarioMap>(_configuration, query, parameters).ToList();
            return usuarios;
        }

        public UsuarioMap BuscarUsuarioById(int usuarioId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", usuarioId);
            var query = "SELECT * FROM usuario WHERE usuario_id = @Id";
            var usuario = DataBase.Execute<UsuarioMap>(_configuration, query, parameters).FirstOrDefault()
                ?? throw new Exception("Usuário não encontrado.");
            return usuario;
        }

        public void AlterarStatusUsuario(int usuarioId, int status)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@Id", usuarioId);
            parameters.Add("@Status", status);
            var query = "update usuario set habilitado = @Status WHERE usuario_id = @Id";

            DataBase.Execute(_configuration, query, parameters);
        }


        public void AtualizarUsuario(UsuarioMap usuarioMap)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", usuarioMap.Usuario_id);
            parameters.Add("@Nome", usuarioMap.Nome);
            parameters.Add("@Email", usuarioMap.Email);
            parameters.Add("@Tipo", usuarioMap.Tipo_usuario_id);
            parameters.Add("@Cpf", usuarioMap.Cpf);
            parameters.Add("@Comissao", usuarioMap.Percentual_comissao);
            var sql = @"UPDATE usuario SET nome = @Nome,email = @Email,tipo_usuario_id = @Tipo,cpf = @Cpf,percentual_comissao = @Comissao 
                        WHERE usuario_id = @Id";

            DataBase.Execute(_configuration, sql, parameters);
        }

        public void ResetaSenhaUsuario(int id, string senha)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            parameters.Add("@Senha", senha);
            var sql = @"UPDATE usuario SET senha = @Senha
                        WHERE usuario_id = @Id";
            DataBase.Execute(_configuration, sql, parameters);
        }

        public List<UsuarioMap> BuscarVendedores()
        {
            var sql = @"SELECT * FROM usuario WHERE tipo_usuario_id = 1 AND habilitado = 1";
            var usuarios = DataBase.Execute<UsuarioMap>(_configuration, sql, new { }).ToList();
            return usuarios;
        }
    }
}
