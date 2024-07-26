import { IDocumentosCliente } from "./documentosCliente";

export interface ICatalogoDocumento {
    idCatalogoDocumento: number;
    nombre: string;
    tipo: string;
    estatus: number;
    documentosClientes?: IDocumentosCliente[];
}

