import { eTipoUsuario } from '../enum/eTipoUsuario';
export const GetDataUser = () => {
    let access_token = window.localStorage.getItem("access_token");
    if (!access_token) window.location.href = '/login';
    const data = JSON.parse(atob(access_token.split('.')[1]));
    const split = JSON.stringify(data).split(',');
    let id = 0;
    split.forEach(element => {
        if (element.includes("userdata"))
            id = element.split(":")[2];
    });
    return {
        TipoUsuario: parseInt(data.role),
        UsuarioId: parseInt(id.replaceAll('"', '').replaceAll("'", '')),
        IsMaster: parseInt(data.role) === eTipoUsuario.Master
    }
}