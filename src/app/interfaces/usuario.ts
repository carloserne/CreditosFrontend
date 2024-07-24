export interface IUsuario {
    idUsuario: number;
    idRol: number;
    usuario1: string;
    contrasenia: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    idEmpresa: number;
    idEmpresaNavigation: any;
    idModulos: any[];
    idRolNavigation: any;
    imagen: string;
}
