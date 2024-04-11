using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;

namespace carvao_app.Models.Dtos
{
    public class ClienteDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Cpf { get; set; }
        public string Cnpj { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Proprietario { get; set; }
        public DateTime DataCadastro { get; set; }
        public string InscricaoEstadual { get; set; }
        public string InscricaoMunicipal { get; set; }
        public string ResponsavelCompra { get; set; }
        public string ResponsavelCompraEmail { get; set; }
        public string ResponsavelCompraTelefone { get; set; }
        public string ResponsavelCompraTelefoneFixo { get; set; }
        public string Observacao { get; set; }
        public bool PessoaFisica { get; set; }
        public bool Inativo { get; set; }
        public decimal ValorTotalPedidos { get; set; }
        public int Endereco_id { get; set; }
        public string Cep { get; set; }
        public string Logradouro { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string Localidade { get; set; }
        public string Uf { get; set; }
        public string Numero { get; set; }

        public List<ClienteDto> ToDtoList(List<ClienteMap> list)
        {
            List<ClienteDto> dto = new();

            foreach (var map in list)
            {
                dto.Add(new ClienteDto
                {
                    Id = map.Cliente_id,
                    Nome = map.Nome,
                    Cpf = map.Cpf,
                    Cnpj = map.Cnpj,
                    Email = map.Email,
                    Telefone = map.Telefone,
                    Proprietario = map.Proprietario,
                    DataCadastro = map.data_cadastro,
                    InscricaoEstadual = map.Inscricao_estadual,
                    InscricaoMunicipal = map.Inscricao_municipal,
                    ResponsavelCompra = map.Responsavel_compra,
                    ResponsavelCompraEmail = map.Responsavel_compra_email,
                    ResponsavelCompraTelefone = map.Responsavel_compra_telefone,
                    ResponsavelCompraTelefoneFixo = map.Responsavel_compra_telefone_fixo,
                    Observacao = map.Observacao,
                    PessoaFisica = map.PessoaFisica,
                    Inativo = map.Inativo,
                    ValorTotalPedidos = map.ValorTotalPedidos,

                    Endereco_id = map.Endereco != null ? map.Endereco.Endereco_id : 0,
                    Cep = map.Endereco != null ? map.Endereco.Cep:"" ,
                    Logradouro = map.Endereco != null ? map.Endereco.Logradouro :"",
                    Complemento = map.Endereco != null ? map.Endereco.Complemento : "",
                    Bairro = map.Endereco != null ? map.Endereco.Bairro : "",
                    Localidade = map.Endereco != null ? map.Endereco.Localidade : "",
                    Uf = map.Endereco != null ? map.Endereco.Uf : "",
                    Numero = map.Endereco != null ? map.Endereco.Numero : ""
                });
            }

            return dto;
        }

        public ClienteDto ToDto(ClienteMap map)
        {
            return new ClienteDto
            {
                Id = map.Cliente_id,
                Nome = map.Nome,
                Cpf = map.Cpf,
                Cnpj = map.Cnpj,
                Email = map.Email,
                Telefone = map.Telefone,
                Proprietario = map.Proprietario,
                DataCadastro = map.data_cadastro,
                InscricaoEstadual = map.Inscricao_estadual,
                InscricaoMunicipal = map.Inscricao_municipal,
                ResponsavelCompra = map.Responsavel_compra,
                ResponsavelCompraEmail = map.Responsavel_compra_email,
                ResponsavelCompraTelefone = map.Responsavel_compra_telefone,
                ResponsavelCompraTelefoneFixo = map.Responsavel_compra_telefone_fixo,
                Observacao = map.Observacao,
                PessoaFisica = map.PessoaFisica,
                Inativo = map.Inativo
            };
        }
    }
}
