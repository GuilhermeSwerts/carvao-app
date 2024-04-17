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

namespace carvao_app.Repository.Services
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly IConfiguration _configuration;

        public UsuarioRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public UsuarioMap Login(string cpf, string senha)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Cpf", cpf.Replace(".","").Replace("-", ""));

            var query = "select * from usuario WHERE cpf = @Cpf";
            var usuario = DataBase.Execute<UsuarioMap>(_configuration, query, parameters).FirstOrDefault()
                ?? throw new Exception("Usuário ou senha inválido.");

            if(Cripto.Decrypt(usuario.Senha) != senha)
                throw new Exception("senha inválida.");

            return usuario;
        }
    }
}
