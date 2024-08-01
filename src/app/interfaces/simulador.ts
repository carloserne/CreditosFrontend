export interface ISimulador {
  metodoCalculo: string;
  subMetodoCalculo: string;
  periodicidad: string;
  numPagos: number;
  interesAnual: number;
  iva: number;
  ivaExento: boolean;
  fechaInicio: Date;
  monto: number;
}
