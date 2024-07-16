import Swal from 'sweetalert2'

const Alert = (texto, sucesso = true, info = false) => {
    Swal.fire({
        title: sucesso ? "" : "Atenção",
        text: texto,
        icon: info ? "info" : sucesso ? "success" : "error"
    });
};

const Pergunta = (texto) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: texto,
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "SIM",
            cancelButtonText: "NÃO"
        }).then((result) => {
            resolve(result.isConfirmed);
        });
    });
};

export { Alert, Pergunta };