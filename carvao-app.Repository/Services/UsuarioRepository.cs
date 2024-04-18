using carvao_app.Repository.Conexao;
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

        public void BuscarNovoUsuarios(UsuarioMap usuarioMap)
        {
            usuarioMap.Cpf = usuarioMap.Cpf.Replace("-", "").Replace(".", "");
            bool exist = DataBase.Execute<UsuarioMap>(_configuration, "select * from usuario where cpf = @Cpf", new
            {
                usuarioMap.Cpf
            }).Any();
            if (exist) throw new Exception("Usuário já existente.");

            var parameters = new DynamicParameters();
            parameters.Add("@Nome", usuarioMap.Nome);
            parameters.Add("@Email", usuarioMap.Email);
            parameters.Add("@Senha", usuarioMap.Senha);
            parameters.Add("@Data", usuarioMap.Data_cadastro);
            parameters.Add("@Tipo", usuarioMap.Tipo_usuario_id);
            parameters.Add("@Cpf", usuarioMap.Cpf);

            var query = @"INSERT INTO carvaodb.usuario
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

            if (Cripto.Decrypt(usuario.Senha) != senha)
                throw new Exception("senha inválida.");

            return usuario;
        }
    }
}
