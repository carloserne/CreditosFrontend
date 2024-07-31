import { IConcepto } from "./concepto";

export interface IProducto {
    idProducto: number,
    nombreProducto: string,
    reca: number,
    metodoCalculo: string,
    subMetodo: string,
    monto: number,
    periodicidad: string,
    numPagos: number,
    interesAnual: number,
    iva: number,
    interesMoratorio: number,
    aplicacionDePagos: string,
    idEmpresa: number,
    estatus: 0,
    detalleProductos?: any[]
}