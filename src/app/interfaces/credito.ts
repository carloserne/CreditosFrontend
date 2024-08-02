import { IAval } from "./aval";
import { IObligado } from "./obligados";

export interface ICredito {
    idCredito: number;
    idProducto: number;
    monto: number;
    estatus: number;
    iva: number;
    periodicidad: string;
    fechaFirma?: Date | null;
    fechaActivacion?: Date | null;
    numPagos: number;
    interesOrdinario: number;
    idPromotor: number;
    idCliente: number;
    interesMoratorio: number;
    avals?: any[];
    obligados?: IObligado[];
    nombreCliente?: string;
    regimenFiscal?: string;
}
