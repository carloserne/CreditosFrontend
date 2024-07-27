import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientesService } from '../../services/clientes.service';
import { DocumentosService } from '../../services/documentos.service';
import { DocumentPorClienteService } from '../../services/documento-cliente.service';
import { ICliente } from '../../interfaces/cliente';
import { IDocumento } from '../../interfaces/documentos';
import { CommonModule } from '@angular/common';
import { INuevoDocumento } from '../../services/nuevoDocumento';

@Component({
    selector: 'app-documentousuario',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './documentousuario.component.html',
    styleUrls: ['./documentousuario.component.scss']
})
export class DocumentousuarioComponent implements OnInit {
    modalTitle: string = '';
    clienteNombre: string = ''; 
    clienteTipo: string = '';
    documentoCForm: FormGroup;
    clientes: ICliente[] = [];
    documentos: IDocumento[] = [];
    documentosCliente: any[] = [];
    documentosFaltantes: IDocumento[] = [];
    documentosSubidos: any[] = [];
    selectedFileName: { [key: number]: string } = {};
    idClienteSeleccionado: number = 0;
    selectedDocumento: IDocumento | null = null;
    documentoBase64: string = '';

    @ViewChild('fileInput') fileInput!: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private clientesService: ClientesService,
        private documentosService: DocumentosService,
        private documentPorClienteService: DocumentPorClienteService
    ) {
        this.documentoCForm = this.fb.group({
            idDocumento: [0],
            idCliente: [1]
        });
    }

    ngOnInit(): void {
        this.obtenerClientes();
        this.obtenerDocumentos();
    }

    obtenerClientes(): void {
        this.clientesService.getClientes().subscribe({
            next: (data: ICliente[]) => {
                this.clientes = data;
            },
            error: (error) => {
                this.toastr.error('Error al obtener la lista de clientes', 'Error');
            }
        });
    }

    obtenerDocumentos(): void {
        this.documentosService.getDocumentos().subscribe(
            (data: IDocumento[]) => {
                this.documentos = data;
            },
            (error) => {
                this.toastr.error('No se pudieron obtener los documentos. Inténtelo de nuevo más tarde.', 'Error');
            }
        );
    }

    obtenerDocumentosPorCliente(idCliente: number, regimenFiscal: string): void {
        this.documentPorClienteService.getDocumentosCliente(idCliente).subscribe({
            next: (data: any[]) => {
                this.documentosCliente = data;
                this.categorizarDocumentos(regimenFiscal);
            },
            error: (error) => {
                this.toastr.error('No se pudieron obtener los documentos del cliente. Inténtelo de nuevo más tarde.', 'Error');
            }
        });
    }

    categorizarDocumentos(regimenFiscal: string): void {
        this.documentosFaltantes = [];
        this.documentosSubidos = [];
    
        const documentosFiltrados = this.documentos.filter(doc => doc.tipo === regimenFiscal);
    
        documentosFiltrados.forEach(doc => {
            const clienteDoc = this.documentosCliente.find(d => d.idDocumento === doc.idCatalogoDocumento);
            if (clienteDoc && clienteDoc.documentoBase64) {
                this.documentosSubidos.push({
                    ...doc,
                    documentoBase64: clienteDoc.documentoBase64
                });
            } else {
                this.documentosFaltantes.push(doc);
            }
        });
    }

    openDocumentosModal(idCliente: number, regimenFiscal: string): void {
        this.idClienteSeleccionado = idCliente;
        this.obtenerDocumentosPorCliente(idCliente, regimenFiscal);

        const cliente = this.clientes.find(c => c.idCliente === idCliente);
        if (cliente) {
            if (regimenFiscal === 'MORAL') {
                this.clienteNombre = cliente.datosClienteMorals && cliente.datosClienteMorals.length > 0
                    ? cliente.datosClienteMorals[0].nombreRepLegal || 'N/A'
                    : 'N/A';
                this.clienteTipo = 'Moral';
            } else {
                this.clienteNombre = cliente.datosClienteFisicas && cliente.datosClienteFisicas.length > 0
                    ? cliente.datosClienteFisicas[0].idPersonaNavigation
                        ? (cliente.datosClienteFisicas[0].idPersonaNavigation.nombre + ' '
                            + cliente.datosClienteFisicas[0].idPersonaNavigation.apellidoPaterno + ' '
                            + cliente.datosClienteFisicas[0].idPersonaNavigation.apellidoMaterno)
                        : 'N/A'
                    : 'N/A';
                this.clienteTipo = 'Física';
            }
        }

        this.modalTitle = `Documentos del Cliente: ${this.clienteNombre} (${this.clienteTipo})`;

        const modalElement = this.elementRef.nativeElement.querySelector('#documentosModal');
        if (modalElement) {
            const modalInstance = new (window as any).bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.show();
        }
    }

    onModalClose(): void {
        this.documentoCForm.reset();
        this.selectedDocumento = null;
        this.selectedFileName = {};
        this.documentoBase64 = '';
    }

    guardar(): void {
        if (!this.selectedDocumento) {
            this.toastr.error('Seleccione un documento para subir.', 'Error');
            return;
        }

        const nuevoDocumento: INuevoDocumento = {
            idDocumentoCliente: this.selectedDocumento.idCatalogoDocumento,
            documentoBase64: this.documentoBase64,
            estatus: 1,
        };

        this.documentPorClienteService.guardarDocumento(nuevoDocumento).subscribe({
            next: () => {
                this.toastr.success('Documento guardado exitosamente.', 'Éxito');
                this.onModalClose();
            },
            error: () => {
                this.toastr.error('No se pudo guardar el documento. Inténtelo de nuevo más tarde.', 'Error');
            }
        });
    }

    onDocumentoSelect(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const selectedValue = selectElement.value;

        if (selectedValue) {
            const selectedDoc = this.documentosFaltantes.find(doc => doc.idCatalogoDocumento === parseInt(selectedValue, 10));
            if (selectedDoc) {
                this.selectedDocumento = selectedDoc;
            } else {
                this.selectedDocumento = null;
            }
        } else {
            this.selectedDocumento = null;
        }
    }

    handleFileInputClick(): void {
        this.fileInput.nativeElement.click();
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = e.target.result.split(',')[1];
                if (this.selectedDocumento) {
                    this.selectedFileName[this.selectedDocumento.idCatalogoDocumento] = file.name;
                    this.documentoBase64 = base64;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    verDocumento(base64: string): void {
        // Eliminar el prefijo 'data:application/pdf;base64,' si está presente
        if (base64.startsWith('data:application/pdf;base64,')) {
            base64 = base64.replace('data:application/pdf;base64,', '');
        }
    
        try {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error('Failed to open PDF:', error);
            this.toastr.error('No se pudo abrir el documento PDF. Inténtelo de nuevo más tarde.', 'Error');
        }
    }
}
