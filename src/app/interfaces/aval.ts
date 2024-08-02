import { IPersona } from "./persona";
import { IPersonaMoral } from "./personaMoral";

export interface IAval {
    idAval?: number;
    idCredito?: number;
    idPersona?: number;
    idPersonaMoral?: number;
    idPersonaNavigation?: IPersona;
    idPersonaMoralNavigation?: IPersonaMoral;
}
