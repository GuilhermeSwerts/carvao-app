using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class ClienteMap
    {
        public int Cliente_id { get; set; }
        public string Nome { get; set; }
        public string Cpf { get; set; }
        public string Cnpj { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Proprietario { get; set; }
        public DateTime data_cadastro { get; set; }
        public string Inscricao_estadual { get; set; }
        public string Inscricao_municipal { get; set; }
        public string Responsavel_compra { get; set; }
        public string Responsavel_compra_email { get; set; }
        public string Responsavel_compra_telefone { get; set; }
        public string Responsavel_compra_telefone_fixo { get; set; }
        public string Observacao { get; set; }
        public bool PessoaFisica { get; set; }
        public bool Inativo { get; set; }
        public decimal ValorTotalPedidos { get; set; }
        public EnderecoMap Endereco { get; set; } = new();
    }
}
