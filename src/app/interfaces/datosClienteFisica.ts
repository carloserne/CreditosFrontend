import { ICliente } from "./cliente";
import { IPersona } from "./persona";

export interface IDatosClienteFisica {
    idClienteFisica: number;
    idPersona?: number;
    idCliente?: number;
    idClienteNavigation?: ICliente;
    idPersonaNavigation?: IPersona;
}

