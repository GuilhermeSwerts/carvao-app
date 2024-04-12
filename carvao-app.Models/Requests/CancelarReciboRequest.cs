using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Requests
{
    public class CancelarReciboRequest
    {
        public int Id { get; set; }
        public string justificativa { get; set;}
    }
}
