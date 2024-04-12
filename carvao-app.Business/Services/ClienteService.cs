using carvao_app.Business.Interfaces;
using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using carvao_app.Repository.Interfaces;
using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;

namespace carvao_app.Business.Services
{
    public class ClienteService : IClientesService
    {
        private readonly IClienteRepository _repository;

        public ClienteService(IClienteRepository repository)
        {
            _repository = repository;
        }

        public List<ClienteDto> BuscarClientes(string q, string dtInicio, string dtFim,bool valores)
        {
            var resposta = _repository.BuscarClientes(q, dtInicio, dtFim, valores);

            return new ClienteDto().ToDtoList(resposta.OrderBy(c=> c.Nome).ToList());
        }

        public ClienteDto BuscarClientesId(int id)
        {
            var resposta = _repository.BuscarClientesId(id);
            return new ClienteDto().ToDto(resposta);
        }

        public void NovoCliente(ClienteRequest request)
        {
            var map = new ClienteMap
            {
                Nome = request.Nome,
                Cpf = request.Cpf,
                Cnpj = request.Cnpj,
                Email = request.Email,
                Telefone = request.Telefone,
                Proprietario = request.Proprietario,
                data_cadastro = request.DataCadastro,
                Inscricao_estadual = request.InscricaoEstadual,
                Inscricao_municipal = request.InscricaoMunicipal,
                Responsavel_compra = request.ResponsavelCompra,
                Responsavel_compra_email = request.ResponsavelCompraEmail,
                Responsavel_compra_telefone = request.ResponsavelCompraTelefone,
                Responsavel_compra_telefone_fixo = request.ResponsavelCompraTelefoneFixo,
                Observacao = request.Observacao,
                PessoaFisica = request.PessoaFisica,
                Endereco = new EnderecoMap
                {
                    Bairro = request.Bairro,
                    Cep = request.Cep,
                    Complemento = request.Complemento,
                    Localidade = request.Localidade,
                    Logradouro = request.Logradouro,
                    Uf = request.Uf,
                    Numero = request.Numero
                }
            };

            if (ExisteCliente(map))
                throw new Exception("Cliente já cadastrado!");

            _repository.InserirCliente(map);
        }

        public void AtualizaDadosCliente(ClienteRequest request)
        {

            var map = new ClienteMap
            {
                Cliente_id = (int)request.Id,
                Nome = request.Nome,
                Cpf = request.Cpf,
                Cnpj = request.Cnpj,
                Email = request.Email,
                Telefone = request.Telefone,
                Proprietario = request.Proprietario,
                data_cadastro = request.DataCadastro,
                Inscricao_estadual = request.InscricaoEstadual,
                Inscricao_municipal = request.InscricaoMunicipal,
                Responsavel_compra = request.ResponsavelCompra,
                Responsavel_compra_email = request.ResponsavelCompraEmail,
                Responsavel_compra_telefone = request.ResponsavelCompraTelefone,
                Responsavel_compra_telefone_fixo = request.ResponsavelCompraTelefoneFixo,
                Observacao = request.Observacao,
                PessoaFisica = request.PessoaFisica,
                Endereco = new EnderecoMap
                {
                    Bairro = request.Bairro,
                    Cep = request.Cep,
                    Complemento = request.Complemento,
                    Localidade = request.Localidade,
                    Logradouro = request.Logradouro,
                    Uf = request.Uf,
                    Numero = request.Numero
                }
            };

            _repository.AtualizaDadosCliente(map);
        }

        public void AlterarStatusCliente(int id,bool status)
        {
            _repository.AlterarStatusCliente(id, status);
        }


        #region Privates

        private bool ExisteCliente(ClienteMap cliente)
        {
            return _repository.ExistCliente(cliente);
        }

        #endregion
    }
}
