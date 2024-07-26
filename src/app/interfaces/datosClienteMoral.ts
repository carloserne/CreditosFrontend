import { ICliente } from "./cliente";
import { IPersonaMoral } from "./personaMoral";

export interface IDatosClienteMoral {
    idClienteMoral: number;
    idPersonaMoral?: number;
    nombreRepLegal: string;
    rfcrepLegal: string;
    idCliente?: number;
    idClienteNavigation?: ICliente;
    idPersonaMoralNavigation?: IPersonaMoral;
}

