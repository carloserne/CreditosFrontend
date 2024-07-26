import { ICatalogoDocumento } from "./catalogoDocumento";
import { ICliente } from "./cliente";

export interface IDocumentosCliente {
    idDocumentoCliente: number;
    documentoBase64: string;
    estatus: number;
    idDocumento?: number;
    idCliente?: number;
    idClienteNavigation?: ICliente;
    idDocumentoNavigation?: ICatalogoDocumento;
}

