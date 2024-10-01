export interface IQuejasSugerencias {
    idQuejaSugerencia: number,
    idEmpresa: number,
    tipo: string,
    descripcion: string,
    fechaRegistro: string,
    estado: number,
    fechaResolucion?: string
    responsable?: number,
    prioridad?: number,
    comentarios?: string,
}