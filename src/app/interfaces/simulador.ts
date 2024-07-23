export interface ISimulador {
    simuladorId: number;
    metodoCalculo: string;
    subMetodoCalculo: string;
    monto: number;
    numPagos: number;
    formaPago: string;
    fechaInicio: Date;
    interesAnual: number;
    iva: number;
}