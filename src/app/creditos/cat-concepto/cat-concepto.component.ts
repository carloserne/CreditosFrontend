import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-cat-concepto',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cat-concepto.component.html',
    styleUrl: './cat-concepto.component.scss'
})
export class CatConceptoComponent {
    modalTitle: string = '';
    modalRef: any;

    constructor(
        private elementRef: ElementRef,
        private fb: FormBuilder,
        private toastr: ToastrService
    ) {

    }

    openModal(mode: 'add' | 'edit'): void {
        this.modalTitle = mode === 'add' ? 'Agregar Documento' : 'Editar Documento';

        if (mode === 'add') {
            // this.documentoForm.reset();
        } 
        // else if (mode === 'edit' && documento) {
        //     this.documentoForm.patchValue({
        //         idCatalogoDocumento: documento.idCatalogoDocumento,
        //         nombre: documento.nombre,
        //         tipo: documento.tipo,
        //         estatus: documento.estatus,
        //         idEmpresa: documento.idEmpresa
        //     })
        // }

        const modalElement = this.elementRef.nativeElement.querySelector('#staticBackdrop');
        if (modalElement) {
            const modalInstance = new (window as any).bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.show();
        }
    }
}
