export interface IAmortizacion {
    numPago: number;
    saldoInsoluto: number;
    capital: number;
    interes: number;
    iva: number;
    ivaSobreInteres: number;
    interesMasIva: number;
    pagoFijo: number;
    fechaInicio: Date;
    fechaFin: Date;
}
