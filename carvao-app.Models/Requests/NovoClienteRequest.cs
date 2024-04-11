using System;

namespace carvao_app.Models.Requests
{
    public class ClienteRequest
    {
        public int? Id { get; set; }
        public string Nome { get; set; }
        public string Cpf { get; set; }
        public string Cnpj { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Proprietario { get; set; }
        public DateTime DataCadastro { get; set; }
        public string? InscricaoEstadual { get; set; }
        public string? InscricaoMunicipal { get; set; }
        public string? ResponsavelCompra { get; set; }
        public string? ResponsavelCompraEmail { get; set; }
        public string? ResponsavelCompraTelefone { get; set; }
        public string? ResponsavelCompraTelefoneFixo { get; set; }
        public string? Observacao { get; set; }
        public bool PessoaFisica { get; set; }
        public string Cep { get; set; }
        public string Logradouro { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string Localidade { get; set; }
        public string Uf { get; set; }
        public string Numero { get; set; }
    }
}
