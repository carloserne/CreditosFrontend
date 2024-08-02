import { IPersona } from "./persona";
import { IPersonaMoral } from "./personaMoral";

export interface IObligado {
    idObligado?: number;
    idCredito?: number;
    idPersona?: number;
    idPersonaMoral?: number;
    idPersonaNavigation?: IPersona;
    idPersonaMoralNavigation?: IPersonaMoral;
}
