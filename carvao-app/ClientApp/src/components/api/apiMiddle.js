import { api } from './api';

export const buscarClientes = async (query, dtInicio, dtFim) => {

    try {
        const response = await api.getSync(`api/Cliente/BuscarClientes`, {
            params: {
                q: query || "",
                dtInicio: dtInicio || "",
                dtFim: dtFim || ""
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
