export interface IAmortizacionActiva {
    idAmortizacion: number;
    idCredito: number;
    fechaInicio: Date;
    fechaFin: Date;
    estatus: number;
    saldoInsoluto: number;
    capital: number;
    interesOrdinario: number;
    iva: number;
    interesMasIva: number;
    pagoFijo: number;
    interesMoratorio: number;
}