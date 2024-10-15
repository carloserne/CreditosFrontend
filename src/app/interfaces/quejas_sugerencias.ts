import { IEmpresa } from "./empresa"
import { IUsuario } from "./usuario"

export interface IQuejasSugerencias {
    idQuejaSugerencia: number,
    idEmpresa: number,
    idEmpresaNavigation?: IEmpresa,
    tipo: string,
    descripcion: string,
    fechaRegistro: string,
    estatus: number,
    fechaResolucion?: string
    responsable?: number,
    responsableNavigation?: IUsuario,
    prioridad?: number,
    comentarios?: string,
}