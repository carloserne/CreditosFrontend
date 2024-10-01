import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IQuejasSugerencias } from '../interfaces/quejas_sugerencias';
import { ToastrService } from 'ngx-toastr';
import { QuejasService } from '../services/quejas.service';

declare let Swal: any;

@Component({
    selector: 'app-quejas-sugerencias',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './quejas-sugerencias.component.html',
    styleUrl: './quejas-sugerencias.component.scss'
})
export class QuejasSugerenciasComponent {
    modalTitle: string = '';
    quejaForm: FormGroup;
    quejas: IQuejasSugerencias[] = [];

    constructor(
        private elementRef: ElementRef,
        private fb: FormBuilder,
        private quejasService: QuejasService,
        private toastr: ToastrService
    ) {
        this.quejaForm = this.fb.group({
            idQuejaSugerencia: [0],
            idEmpresa: [1, Validators.required],
            tipo: ['', Validators.required],
            descripcion: ['', Validators.required],
            fechaRegistro: ['', Validators.required],
            estado: [1, Validators.required],
            fechaResolucion: [''],
            responsable: [1],
            prioridad: [0],
            comentarios: ['']
        });
        this.quejas = [
            {
                idQuejaSugerencia: 1,
                idEmpresa: 1,
                tipo: 'Q',
                descripcion: 'Demora en la entrega de productos.',
                fechaRegistro: '2024-09-01',
                estado: 1,
                fechaResolucion: '',
                responsable: 1,
                prioridad: 1,
                comentarios: 'Cliente molesto por la tardanza en la entrega.'
            },
            {
                idQuejaSugerencia: 2,
                idEmpresa: 1,
                tipo: 'S',
                descripcion: 'Mejorar el sistema de atención al cliente.',
                fechaRegistro: '2024-09-15',
                estado: 1,                fechaResolucion: '2024-09-20',
                responsable: 1,
                prioridad: 1,
                comentarios: 'Sugerencia implementada con éxito.'
            },
            {
                idQuejaSugerencia: 3,
                idEmpresa: 1,
                tipo: 'Q',
                descripcion: 'Producto defectuoso recibido.',
                fechaRegistro: '2024-09-22',
                estado: 1,
                fechaResolucion: '',
                responsable: 1,
                prioridad: 1,
                comentarios: 'Producto será reemplazado.'
            }
        ];
    }

    obtenerQuejas(){
        this.quejasService.getQuejas().subscribe({
            next: (quejas) => {
                this.quejas = quejas;
            },
            error: (error) => {
                this.toastr.error('Error al obtener las quejas o sugerencias', "Error");
            }
        })
    }

    openModalDetalles(queja: IQuejasSugerencias) {
        console.log(queja)
        if (queja.idQuejaSugerencia == 0) {
            this.toastr.error('No se encontró el ID de la queja.');
            return;
        }

        this.modalTitle = 'Detalles de la queja o sugerencia';

        this.quejaForm.patchValue({
            idQuejaSugerencia: queja.idQuejaSugerencia,
            idEmpresa: queja.idEmpresa,
            tipo: queja.tipo,
            descripcion: queja.descripcion,
            fechaRegistro: queja.fechaRegistro,
            estado: queja.estado,
            fechaResolucion: queja.fechaResolucion,
            responsable: queja.responsable,
            prioridad: queja.prioridad,
            comentarios: queja.comentarios
        });

        this.quejaForm.disable();

        const modalElement = this.elementRef.nativeElement.querySelector('#staticBackdrop');
        if (modalElement) {
            const modalInstance = new (window as any).bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.show();
        }
    }

    closeModalDetalle() {
        const modalElement = this.elementRef.nativeElement.querySelector('#staticBackdrop');
        if (modalElement) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
        this.onModalClose();
    }

    onModalClose() {
        this.quejaForm.reset();
    }

    // Modal de guardar y editar
    openModal(mode: 'add' | 'edit', queja?: IQuejasSugerencias): void {
        this.modalTitle = mode === 'add' ? 'Agregar queja o sugerencia' : 'Editar queja o sugerencia';

        if (mode === 'add') {
            this.quejaForm.reset();
        } else if (mode === 'edit' && queja) {
            this.quejaForm.patchValue({
                idQuejaSugerencia: queja.idQuejaSugerencia,
                idEmpresa: queja.idEmpresa,
                tipo: queja.tipo,
                descripcion: queja.descripcion,
                fechaRegistro: queja.fechaRegistro,
                estado: queja.estado,
                fechaResolucion: queja.fechaResolucion,
                responsable: queja.responsable,
                prioridad: queja.prioridad,
                comentarios: queja.comentarios
            });
        }

        const modalElement = this.elementRef.nativeElement.querySelector('#modalge');
        if (modalElement) {
            const modalInstance = new (window as any).bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.show();
        }
    }

    closeModalGE() {
        const modalElement = this.elementRef.nativeElement.querySelector('#modalge');
        if (modalElement) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
        this.onModalClose();
    }

    guardar(){
        // this.quejaForm.patchValue({ estatus: 1 });
        if (this.quejaForm.invalid) {
            this.toastr.warning('Debe llenar todos los campos');
            return;
        }

        let queja = this.quejaForm.value;
        if(queja.idQuejaSugerencia){
            this.quejasService.actualizarQueja(queja).subscribe({
                next: (response) => {
                    this.toastr.success('Queja o sugerencia actualizada con exito', "Actualizado");
                    this.closeModalGE();
                    // this.objterQuejas();
                },
                error: (error) => {
                    this.toastr.error('Error al actualizar la queja o sugerencia', "Error");
                }
            });
        } else {
            queja.idQuejaSugerencia = 0;
            this.quejasService.guardarQueja(queja).subscribe({
                next: (response) => {
                    this.toastr.success('Queja o sugerencia guardada con exito', "Guardado");
                    this.closeModalGE();
                    // this.objterQuejas();
                },
                error: (error) => {
                    this.toastr.error('Error al guardar la queja o sugerencia', "Error");
                }
            });
        }
    }

    async eliminar(queja: IQuejasSugerencias) {
        const result = await Swal.fire({
            title: '¿Eliminar queja?',
            text: "¿Estás seguro de eliminar esta queja?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            this.quejasService.eliminarQueja(queja.idQuejaSugerencia).subscribe({
                next: () => {
                    this.toastr.success('Queja eliminada con éxito.', 'Eliminado');
                    // this.obtenerEmpresas();
                },
                error: (error) => {
                    this.toastr.error('Error al eliminar la queja.', 'Error');
                }
            });
        }
    }
}
