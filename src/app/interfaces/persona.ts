export interface IPersona {
    idPersona: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    paisNacimiento: string;
    estadoNacimiento: string;
    genero: string;
    rfc: string;
    curp: string;
    claveElector?: string;
    nacionalidad: string;
    estadoCivil?: string;
    regimenMatrimonial?: string;
    nombreConyuge?: string;
    calle: string;
    numExterior: string;
    numInterior?: string;
    colonia: string;
    codigoPostal: string;
    paisResidencia: string;
    estadoResidencia: string;
    ciudadResidencia: string;
    email: string;
    telefono?: string;
}
