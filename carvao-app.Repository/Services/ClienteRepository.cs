using carvao_app.Repository.Conexao;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlX.XDevAPI;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Services
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly IConfiguration _configuration;

        public ClienteRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<ClienteMap> BuscarClientes(string q, string dtInicio, string dtFim, bool valores = false)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Nome", "%" + q + "%");

            var query = "SELECT * FROM cliente WHERE nome like @Nome";

            if (!string.IsNullOrEmpty(dtInicio) && !string.IsNullOrEmpty(dtFim))
            {
                query += " AND data_cadastro BETWEEN @DataInicio AND @DataFim";
                parameters.Add("@DataInicio", dtInicio + " 00:00:00");
                parameters.Add("@DataFim", dtFim + " 23:59:59");
            }

            var retorno = DataBase.Execute<ClienteMap>(_configuration, query, parameters);

            foreach (var cliente in retorno)
            {
                cliente.Endereco = DataBase.Execute<EnderecoMap>(_configuration, "SELECT * FROM endereco WHERE cliente_id = @Id", new { Id = cliente.Cliente_id }).FirstOrDefault();
            }

            if (valores)
            {
                foreach (var cliente in retorno)
                {
                    var newParameters = new DynamicParameters();
                    newParameters.Add("@Id", cliente.Cliente_id);

                    var subQuery = @"SELECT SUM(valor_total) AS total_valor
                                     FROM pedido
                                     where cliente_id = @Id
                                     GROUP BY cliente_id;";
                    var valor = DataBase.Execute<decimal>(_configuration, subQuery, newParameters).FirstOrDefault();
                    cliente.ValorTotalPedidos = valor;
                }
            }


            return retorno.OrderBy(c => c.Inativo).ToList();
        }

        public ClienteMap BuscarClientesId(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            return DataBase.Execute<ClienteMap>(_configuration, "SELECT * FROM cliente WHERE cliente_id = @Id", parameters).FirstOrDefault();
        }

        public void InserirCliente(ClienteMap request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Nome", request.Nome);
            parameters.Add("@Cpf", request.Cpf);
            parameters.Add("@Cnpj", request.Cnpj);
            parameters.Add("@Email", request.Email);
            parameters.Add("@Telefone", request.Telefone);
            parameters.Add("@Proprietario", request.Proprietario);
            parameters.Add("@EnscricaoEstadual", request.Inscricao_estadual);
            parameters.Add("@InscricaoMunicipal", request.Inscricao_municipal);
            parameters.Add("@ResponsavelCompra", request.Responsavel_compra);
            parameters.Add("@ResponsavelCompraEmail", request.Responsavel_compra_email);
            parameters.Add("@ResponsavelCompraTelefone", request.Responsavel_compra_telefone);
            parameters.Add("@ResponsavelCompraTelefoneFixo", request.Responsavel_compra_telefone_fixo);
            parameters.Add("@Observacao", request.Observacao);
            parameters.Add("@PessoaFisica", request.PessoaFisica ? 1 : 0);

            var cliente_id = DataBase.Execute<int>(_configuration, @"INSERT INTO cliente(nome, Cpf,Cnpj, email, telefone, proprietario, data_cadastro, inscricao_estadual, inscricao_municipal, responsavel_compra, responsavel_compra_email, responsavel_compra_telefone, responsavel_compra_telefone_fixo, observacao,pessoaFisica,Inativo) 
            VALUES(@Nome, @Cpf, @Cnpj, @Email, @Telefone, @Proprietario, now(), @EnscricaoEstadual, @InscricaoMunicipal, @ResponsavelCompra, @ResponsavelCompraEmail, @ResponsavelCompraTelefone, @ResponsavelCompraTelefoneFixo, @Observacao,@PessoaFisica,0); SELECT LAST_INSERT_ID();", parameters).FirstOrDefault();

            parameters = new DynamicParameters();
            parameters.Add("@Cliente_id", cliente_id);
            parameters.Add("@Cep", request.Endereco.Cep);
            parameters.Add("@Logradouro", request.Endereco.Logradouro);
            parameters.Add("@Complemento", request.Endereco.Complemento);
            parameters.Add("@Bairro", request.Endereco.Bairro);
            parameters.Add("@Localidade", request.Endereco.Localidade);
            parameters.Add("@Uf", request.Endereco.Uf);
            parameters.Add("@Numero", request.Endereco.Numero);

            DataBase.Execute(_configuration, @"INSERT INTO endereco
            (cep, logradouro, complemento, bairro, localidade, uf, numero,cliente_id)
            VALUES(@Cep, @Logradouro, @Complemento, @Bairro, @Localidade, @Uf, @Numero,@Cliente_id);", parameters);
        }

        public void AtualizaDadosCliente(ClienteMap request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", request.Cliente_id);
            parameters.Add("@Nome", request.Nome);
            parameters.Add("@Cpf", request.Cpf);
            parameters.Add("@Cnpj", request.Cnpj);
            parameters.Add("@Email", request.Email);
            parameters.Add("@Telefone", request.Telefone);
            parameters.Add("@Proprietario", request.Proprietario);
            parameters.Add("@EnscricaoEstadual", request.Inscricao_estadual);
            parameters.Add("@InscricaoMunicipal", request.Inscricao_municipal);
            parameters.Add("@ResponsavelCompra", request.Responsavel_compra);
            parameters.Add("@ResponsavelCompraEmail", request.Responsavel_compra_email);
            parameters.Add("@ResponsavelCompraTelefone", request.Responsavel_compra_telefone);
            parameters.Add("@ResponsavelCompraTelefoneFixo", request.Responsavel_compra_telefone_fixo);
            parameters.Add("@Observacao", request.Observacao);
            parameters.Add("@PessoaFisica", request.PessoaFisica ? 1 : 0);

            DataBase.Execute(_configuration, @"UPDATE cliente 
                       SET nome = @Nome, 
                           Cpf = @Cpf, 
                           Cnpj = @Cnpj, 
                           email = @Email, 
                           telefone = @Telefone, 
                           proprietario = @Proprietario, 
                           inscricao_estadual = @EnscricaoEstadual, 
                           inscricao_municipal = @InscricaoMunicipal, 
                           responsavel_compra = @ResponsavelCompra, 
                           responsavel_compra_email = @ResponsavelCompraEmail, 
                           responsavel_compra_telefone = @ResponsavelCompraTelefone, 
                           responsavel_compra_telefone_fixo = @ResponsavelCompraTelefoneFixo, 
                           observacao = @Observacao, 
                           pessoaFisica = @PessoaFisica
                       WHERE cliente_id = @Id;", parameters);

            parameters = new DynamicParameters();
            parameters.Add("@Cep", request.Endereco.Cep);
            parameters.Add("@Logradouro", request.Endereco.Logradouro);
            parameters.Add("@Complemento", request.Endereco.Complemento);
            parameters.Add("@Bairro", request.Endereco.Bairro);
            parameters.Add("@Localidade", request.Endereco.Localidade);
            parameters.Add("@Uf", request.Endereco.Uf);
            parameters.Add("@Numero", request.Endereco.Numero);

            var endereco = DataBase.Execute<EnderecoMap>(_configuration, "SELECT * FROM endereco WHERE cliente_id = @Id", new { Id = request.Cliente_id }).FirstOrDefault();
            if (endereco != null)
            {
                parameters.Add("@Endereco_id", endereco.Endereco_id);
                DataBase.Execute(_configuration, @"UPDATE endereco
                SET cep=@Cep, logradouro=@Logradouro, complemento=@Complemento, bairro=@Bairro, localidade=@Localidade, uf=@Uf, Numero=@Numero
                WHERE endereco_id= @Endereco_id;", parameters);
            }
            else
            {
                parameters.Add("@Cliente_id", request.Cliente_id);
                DataBase.Execute(_configuration, @"INSERT INTO endereco
                (cep, logradouro, complemento, bairro, localidade, uf, numero,cliente_id)
                VALUES(@Cep, @Logradouro, @Complemento, @Bairro, @Localidade, @Uf, @Numero,@Cliente_id);", parameters);
            }
        }

        public void AlterarStatusCliente(int id, bool status)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            parameters.Add("@Status", status ? 1 : 0);

            DataBase.Execute(_configuration, @"UPDATE cliente SET Inativo = @Status 
                       WHERE cliente_id = @Id;", parameters);
        }

        public bool ExistCliente(ClienteMap cliente)
        {
            var query = cliente.PessoaFisica ? "Cpf = @Cpf" : "Cnpj = @Cnpj";
            var exist = DataBase.Execute<ClienteMap>(_configuration, $"SELECT * FROM cliente WHERE {query}", new
            {
                cliente.Cpf,
                cliente.Cnpj
            }).FirstOrDefault();

            return exist != null;
        }
    }
}
