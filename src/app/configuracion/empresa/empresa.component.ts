import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresasService } from '../../services/empresas.service';
import { ToastrService } from 'ngx-toastr';
import { IEmpresa } from '../../interfaces/empresa';

@Component({
    selector: 'app-empresa',
    standalone: true,
    imports: [CommonModule, SidebarComponent, ReactiveFormsModule],
    templateUrl: './empresa.component.html',
    styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {
    modalTitle: string = '';
    empresaForm: FormGroup;
    empresas: IEmpresa[] = [];

    constructor(private elementRef: ElementRef, private fb: FormBuilder, private empresasService: EmpresasService, private toastr: ToastrService) {
        this.empresaForm = this.fb.group({
            razonSocial: ['', Validators.required],
            fechaConstitucion: ['', Validators.required],
            numeroEscritura: ['', Validators.required],
            nombreNotario: ['', Validators.required],
            folioMercantil: ['', Validators.required],
            rfc: ['', Validators.required],
            nombreRepresentanteLegal: ['', Validators.required],
            numeroEscrituraRepLeg: ['', Validators.required],
            fechaInscripcion: ['', Validators.required],
            calle: ['', Validators.required],
            colonia: ['', Validators.required],
            cp: ['', Validators.required],
            telefono: ['', Validators.required],
            estado: ['', Validators.required],
            localidad: ['', Validators.required],
            numExterior: ['', Validators.required],
            numInterior: [''],
            email: ['', Validators.required],
            estatus: [1, Validators.required],
            logo: ['']
        });
    }

    async ngOnInit() { 
        await this.obtenerEmpresas();
    }

    openModal(mode: 'add' | 'edit', empresa?: IEmpresa): void {
        this.modalTitle = mode === 'add' ? 'Agregar Empresa' : 'Editar Empresa';

        if (mode === 'add') {
            this.empresaForm.reset();
        } else if (mode === 'edit' && empresa) {
            this.empresaForm.patchValue({
                razonSocial: empresa.razonSocial,
                fechaConstitucion: empresa.fechaConstitucion,
                numeroEscritura: empresa.numeroEscritura,
                nombreNotario: empresa.nombreNotario,
                folioMercantil: empresa.folioMercantil,
                rfc: empresa.rfc,
                nombreRepresentanteLegal: empresa.nombreRepresentanteLegal,
                numeroEscrituraRepLeg: empresa.numeroEscrituraRepLeg,
                fechaInscripcion: empresa.fechaInscripcion,
                calle: empresa.calle,
                colonia: empresa.colonia,
                cp: empresa.cp,
                telefono: empresa.telefono,
                estado: empresa.estado,
                localidad: empresa.localidad,
                numExterior: empresa.numExterior,
                numInterior: empresa.numInterior,
                email: empresa.email,
                estatus: empresa.estatus
                //Falta el logo
            });
        }
    
        const modalTitleElement = this.elementRef.nativeElement.querySelector('#staticBackdropLabel');
        if (modalTitleElement) {
            modalTitleElement.textContent = this.modalTitle;
        }
    
        const modalElement = this.elementRef.nativeElement.querySelector('#staticBackdrop');
        if (modalElement) {
            const modalInstance = new (window as any).bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.show();
        }
    }

    obtenerEmpresas() {
        this.empresasService.getEmpresas().subscribe(
            (data: IEmpresa[]) => {
                this.empresas = data;
                console.log(this.empresas);
            },
            (error) => {
                this.toastr.error('No se pudieron obtener las empresas. Inténtelo de nuevo más tarde.', 'Error');
            }
        )
    }

    saveChanges(): void {
        
    }
}
