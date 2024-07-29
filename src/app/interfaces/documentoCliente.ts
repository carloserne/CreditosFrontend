export interface ICDocumentoCliente {
    idDocumentoCliente: number;
    idDocumento: number;
    idCliente: number;
    DocumentoBase64: string;
    estatus: number;
    estatusSeguimiento?: number;
}
