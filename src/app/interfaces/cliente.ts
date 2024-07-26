import { IDatosClienteFisica } from "./datosClienteFisica";
import { IDatosClienteMoral } from "./datosClienteMoral";
import { IDocumentosCliente } from "./documentosCliente";
import { IEmpresa } from "./empresa";

export interface ICliente {
    idCliente: number;
    regimenFiscal?: string;
    idEmpresa?: number;
    estatus: number;
    datosClienteFisicas?: IDatosClienteFisica[];
    datosClienteMorals?: IDatosClienteMoral[];
    documentosClientes?: IDocumentosCliente[];
    idEmpresaNavigation?: IEmpresa;
}
