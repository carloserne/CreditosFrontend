import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICredito } from '../../interfaces/credito';
import { CreditosService } from '../../services/creditos.service';
import { ICliente } from '../../interfaces/cliente';
import { ClientesService } from '../../services/clientes.service';
import { IPersona } from '../../interfaces/persona';
import { IPersonaMoral } from '../../interfaces/personaMoral';
import { IAval } from '../../interfaces/aval';
import { IObligado } from '../../interfaces/obligados';

declare let Swal: any;

@Component({
    selector: 'app-seguimiento-creditos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './seguimiento-creditos.component.html',
    styleUrls: ['./seguimiento-creditos.component.scss']
})
export class SeguimientoCreditosComponent implements OnInit {
    creditos: ICredito[] = [];
    clientes: ICliente[] = [];
    creditoForm: FormGroup;
    personaForm: FormGroup;
    personaMoralForm: FormGroup;
    mostrarFisica: boolean = false;
    mostrarMoral: boolean = false;
    datosPersona: Array<any> = [];
    datosPersonaMoral: Array<any> = [];
    regimenFiscal: string = '';
    creditoSeleccionado: ICredito = {} as ICredito;

    constructor(
        private elementRef: ElementRef,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private creditosService: CreditosService,
        private clientesService: ClientesService
    ) { 
        this.creditoForm = this.fb.group({
            idCredito: [0],
            idProducto: [0, Validators.required],
            monto: [0, Validators.required],
            estatus: [0],
            iva: [0, Validators.required],
            periodicidad: ['', Validators.required],
            fechaFirma: [null],
            fechaActivacion: [null],
            numPagos: [0, Validators.required],
            interesOrdinario: [0, Validators.required],
            idPromotor: [0],
            idCliente: [0, Validators.required],
            interesMoratorio: [0, Validators.required],
            avals: this.fb.array([]), 
            obligados: this.fb.array([]), 
        });

        this.personaForm = this.fb.group({
            idPersona: [],
            nombre: ['', Validators.required],
            apellidoPaterno: ['', Validators.required],
            apellidoMaterno: ['', Validators.required],
            fechaNacimiento: ['', Validators.required],
            paisNacimiento: ['', Validators.required],
            estadoNacimiento: ['', Validators.required],
            genero: ['', Validators.required],
            rfc: ['', Validators.required],
            curp: ['', Validators.required],
            claveElector: [''],
            nacionalidad: ['', Validators.required],
            estadoCivil: [''],
            regimenMatrimonial: [''],
            nombreConyuge: [''],
            calle: ['', Validators.required],
            numExterior: ['', Validators.required],
            numInterior: [''],
            colonia: ['', Validators.required],
            codigoPostal: ['', Validators.required],
            paisResidencia: ['', Validators.required],
            estadoResidencia: ['', Validators.required],
            ciudadResidencia: ['', Validators.required],
            email: ['', Validators.required],
            telefono: ['']
        });

        this.personaMoralForm = this.fb.group({
            idPersonaMoral: [0],
            razonSocial: ['', Validators.required],
            razonComercial: [''],
            fechaConstitucion: ['', Validators.required],
            rfc: ['', Validators.required],
            nacionalidad: ['', Validators.required],
            paisRegistro: ['', Validators.required],
            estadoRegistro: ['', Validators.required],
            ciudadRegistro: ['', Validators.required],
            numEscritura: ['', Validators.required],
            fechaRppc: [null],
            nombreNotario: [''],
            numNotario: [''],
            folioMercantil: [''],
            calle: ['', Validators.required],
            numExterior: ['', Validators.required],
            numInterior: [''],
            colonia: ['', Validators.required],
            codigoPostal: ['', Validators.required],
            paisResidencia: ['', Validators.required],
            estadoResidencia: ['', Validators.required],
            ciudadResidencia: ['', Validators.required],
        });
    }

    ngOnInit(): void { 
        this.obtenerCreditosYClientes();
    }

    obtenerCreditosYClientes() {
        this.clientesService.getClientes().subscribe(
            (clientes: ICliente[]) => {
                this.clientes = clientes;
                this.obtenerCreditos();
            }
        );
    }

    obtenerCreditos() {
        this.creditosService.getCreditos().subscribe(
            (creditos: ICredito[]) => {
                this.creditos = creditos.map(credito => {
                    const cliente = this.clientes.find(c => c.idCliente === credito.idCliente);
                    let nombreCliente = 'N/A';
                    let regimenFiscal = 'N/A';
                    let idCliente = credito.idCliente;
    
                    if (cliente) {
                        regimenFiscal = cliente.regimenFiscal || 'N/A';
                        idCliente = cliente.idCliente;
    
                        if (cliente.regimenFiscal === 'MORAL' && cliente.datosClienteMorals!.length > 0) {
                            nombreCliente = cliente.datosClienteMorals![0].nombreRepLegal;
                        } else if (cliente.regimenFiscal === 'FISICA' && cliente.datosClienteFisicas!.length > 0) {
                            const persona = cliente.datosClienteFisicas![0].idPersonaNavigation!;
                            nombreCliente = `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`;
                        }
                    }
    
                    return { ...credito, nombreCliente, regimenFiscal, idCliente };
                });
            }
        );
    }

    async eliminar(credito: ICredito) {
        const result = await Swal.fire({
            title: '¿Eliminar documento?',
            text: "¿Estás seguro de eliminar este documento?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            // Lógica para eliminar el crédito
        }
    }

    openModalAval(credito: ICredito) {
        this.creditoSeleccionado = credito;
        console.log(this.creditoSeleccionado);

        const modalElement = this.elementRef.nativeElement.querySelector('#staticBackdrop') as HTMLElement;
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modal.show();
        } else {
            console.error('Modal element not found');
        }
    }

    guardarAval() {
        // Limpiar IDs antiguos antes de preparar los datos para el envío
        const limpiarAvales = (avales: any[]) => {
            return avales.map(aval => {
                const nuevoAval = { ...aval };
                delete nuevoAval.idAval;
                delete nuevoAval.idPersona;
                delete nuevoAval.idPersonaMoral;
                delete nuevoAval.idPersonaNavigation?.idPersona;
                delete nuevoAval.idPersonaMoralNavigation?.idPersonaMoral;
                delete nuevoAval.idCredito;
                return nuevoAval;
            });
        };

        // Limpia los avales existentes antes de agregar nuevos
        if (this.creditoSeleccionado.avals) {
            this.creditoSeleccionado.avals = limpiarAvales(this.creditoSeleccionado.avals);
        } else {
            this.creditoSeleccionado.avals = [];
        }

        if (this.regimenFiscal === 'FISICA') {
            if (!this.personaForm.valid) {
                this.toastr.warning('Por favor, completa todos los campos obligatorios.');
                return;
            }

            const persona = this.personaForm.value;
            delete persona.idPersona;

            this.creditoSeleccionado.avals.push({
                idPersonaNavigation: persona
            });

        } else if (this.regimenFiscal === 'MORAL') {
            if (!this.personaMoralForm.valid) {
                this.toastr.warning('Por favor, completa todos los campos obligatorios.');
                return;
            }

            const personaMoral = this.personaMoralForm.value;
            delete personaMoral.idPersona;
            delete personaMoral.idPersonaMoral;

            this.creditoSeleccionado.avals.push({
                idPersonaMoralNavigation: personaMoral
            });
        } else {
            this.toastr.warning('Por favor, selecciona un tipo de persona');
        }

        console.log("JSON FINAL", this.creditoSeleccionado);
        this.creditosService.actualizarCredito(this.creditoSeleccionado).subscribe({
            next: (response) => {
                this.toastr.success('Aval guardado correctamente.');
                this.onModalClose();
            },
            error: () => {
                this.toastr.error('Error al guardar el aval.');
            }
        });
    }


    onModalClose() {
        const modalElement = this.elementRef.nativeElement.querySelector('#staticBackdrop');
        if (modalElement) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }

        const modalElement2 = this.elementRef.nativeElement.querySelector('#modalObligados');
        if (modalElement2) {
            const modalInstance2 = (window as any).bootstrap.Modal.getInstance(modalElement2);
            if (modalInstance2) {
                modalInstance2.hide();
            }
        }

        this.creditoForm.reset();
        this.creditoSeleccionado = {} as ICredito;
        this.personaForm.reset();
        this.personaMoralForm.reset();
        this.regimenFiscal = '';
        this.mostrarFisica = false;
    }

    onRegimenFiscalChange(event: any): void {
        const selectedValue = event.target.value;
        this.mostrarFisica = selectedValue === 'FISICA';
        this.mostrarMoral = selectedValue === 'MORAL';
    }

    openModalObligados(credito: ICredito) {
        this.creditoSeleccionado = credito;

        const modalElement = this.elementRef.nativeElement.querySelector('#modalObligados') as HTMLElement;
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
            modal.show();
        } else {
            console.error('Modal element not found');
        }
    }

    guardarObligado() {
        // Limpiar IDs antiguos antes de preparar los datos para el envío
        const limpiarObligados = (obligados: any[]) => {
            return obligados.map(obligado => {
                const nuevoObligado = { ...obligado };
                delete nuevoObligado.idPersona;
                delete nuevoObligado.idPersonaMoral;
                delete nuevoObligado.idPersonaNavigation?.idPersona;
                delete nuevoObligado.idPersonaMoralNavigation?.idPersonaMoral;
                delete nuevoObligado.idCredito;
                return nuevoObligado;
            });
        };
    
        // Limpia los obligados existentes antes de agregar nuevos
        if (this.creditoSeleccionado.obligados) {
            this.creditoSeleccionado.obligados = limpiarObligados(this.creditoSeleccionado.obligados);
        } else {
            this.creditoSeleccionado.obligados = [];
        }
    
        if (this.regimenFiscal === 'FISICA') {
            if (!this.personaForm.valid) {
                this.toastr.warning('Por favor, completa todos los campos obligatorios.');
                return;
            }
    
            const persona = this.personaForm.value;
            delete persona.idPersona;
    
            this.creditoSeleccionado.obligados.push({
                idPersonaNavigation: persona
            });
    
        } else if (this.regimenFiscal === 'MORAL') {
            if (!this.personaMoralForm.valid) {
                this.toastr.warning('Por favor, completa todos los campos obligatorios.');
                return;
            }
    
            const personaMoral = this.personaMoralForm.value;
            delete personaMoral.idPersona;
            delete personaMoral.idPersonaMoral;
    
            this.creditoSeleccionado.obligados.push({
                idPersonaMoralNavigation: personaMoral
            });
        } else {
            this.toastr.warning('Por favor, selecciona un tipo de persona');
        }
    
        console.log("JSON FINAL obligados", this.creditoSeleccionado);
        this.creditosService.actualizarCredito(this.creditoSeleccionado).subscribe({
            next: (response) => {
                this.toastr.success('Obligado guardado correctamente.');
                this.onModalClose();
            },
            error: () => {
                this.toastr.error('Error al guardar el obligado.');
            }
        });
    }
    
}
