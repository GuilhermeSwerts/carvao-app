using Dapper;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace carvao_app.Repository.Conexao
{
    public class DataBase
    {
        private readonly string _connectionString;

        public DataBase(IConfiguration configuration)
        {
            _connectionString = configuration["DefaultConnection"];
        }

        public static MySqlConnection Dbo(IConfiguration configuration)
        {
            var connectionString = new DataBase(configuration)._connectionString;
            var con = new MySqlConnection(connectionString);

            try
            {
                con.Open();
                return con;
            }
            catch (MySqlException)
            {
                throw;
            }
        }

        public static IEnumerable<T> Execute<T>(IConfiguration configuration, string query, object parameters)
        {
            using var connection = Dbo(configuration);
            using var tran = connection.BeginTransaction();
            try
            {
                var retorno = connection.Query<T>(query, parameters);
                
                tran.Commit();

                return retorno;
            }
            catch (Exception ex)
            {
                tran.Rollback();
                throw new Exception("Erro ao executar a query: " + ex.Message);
            }
        }

        public static void Execute(IConfiguration configuration, string query, DynamicParameters parameters)
        {
            using var connection = Dbo(configuration);
            using var tran = connection.BeginTransaction();
            try
            {
                connection.Query(query, parameters, commandType: CommandType.Text);
                tran.Commit();
            }
            catch (Exception ex)
            {
                tran.Rollback();
                throw new Exception("Erro ao executar a query: " + ex.Message);
            }
        }
    }
}
