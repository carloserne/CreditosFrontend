import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
    selector: 'app-empresa',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    templateUrl: './empresa.component.html',
    styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {
    modalTitle: string = '';

    constructor(private elementRef: ElementRef) { }

    ngOnInit(): void { }

    openModal(mode: 'add' | 'edit'): void {
        console.log("entro al openModal");
        this.modalTitle = mode === 'add' ? 'Agregar Empresa' : 'Editar Empresa';
    
        // Actualizar el título del modal
        const modalTitleElement = this.elementRef.nativeElement.querySelector('#staticBackdropLabel');
        if (modalTitleElement) {
            modalTitleElement.textContent = this.modalTitle;
        }
    
        // Abrir el modal usando Bootstrap con backdrop estático
        const modalElement = this.elementRef.nativeElement.querySelector('#staticBackdrop');
        if (modalElement) {
            const modalInstance = new (window as any).bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.show();
        }
    }

    saveChanges(): void {
        // Lógica para guardar cambios
    }
}
