import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreditosService } from '../../services/creditos.service';
import { PagosService } from '../../services/pagos.service';
import { ICredito } from '../../interfaces/credito';
import { IAmortizacionActiva } from '../../interfaces/amortizacionActiva';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { IPagoAplicado } from '../../interfaces/pagoAplicado';
import { IPago } from '../../interfaces/pago';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
})
export class PagosComponent implements OnInit {
  modalTitle: string = '';
  pagoForm: FormGroup;
  creditos: ICredito[] = [];
  creditosActivos: ICredito[] = [];
  creditoSeleccionado: ICredito = {} as ICredito;
  amortizacionesAct: IAmortizacionActiva[] = [];
  mostrarAmortizaciones: boolean = false;
  mostrarTablaCreditos: boolean = true;
  mostrarPagos: boolean = false;
  idCreditoSeleccionado: number = 0;
  idPagoAAplicar: number = 0;
  pagoAplicado: IPagoAplicado = { idCredito: 0, montoPago: 0 };
  pagos: IPago[] = [];


  constructor(
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private creditosService: CreditosService,
    private pagosService: PagosService
  ) {
    this.pagoForm = this.fb.group({
      idCredito: [{ value: 0, disabled: true }, Validators.required],
      montoPago: [0, Validators.required],
  });

  }

  ngOnInit(): void {
    this.obtenerCreditos();
    
  }

  obtenerPagos(idCredito: number) {
    this.pagosService.getPagos(idCredito).subscribe({
        next: (pagos) => {
            this.pagos = pagos;
            console.log(this.pagos);
            this.mostrarPagos = true;
        },
        error: (error) => {
            this.toastr.error('No se pudieron obtener los pagos. Inténtelo de nuevo más tarde.', 'Error');
        }
    })
  }


  obtenerCreditos() {
    this.creditosService.getCreditos().subscribe({
        next: (creditos) => {
            this.creditos = creditos;
            if(this.creditos.length > 0) {
                this.creditosActivos = this.creditos.filter(credito => credito.estatus === 3);
            }
            console.log(this.creditosActivos);
        },
        error: (error) => {
            this.toastr.error('No se pudieron obtener los productos. Inténtelo de nuevo más tarde.', 'Error');
        }
    })
  }
  obtenerAmortizaciones(idCredito: number) {
    this.creditosService.obtenerAmortizaciones(idCredito).subscribe({
        next: (amortizaciones) => {
            this.amortizacionesAct = amortizaciones;
            console.log(this.amortizacionesAct);
            this.idCreditoSeleccionado = idCredito;
            this.mostrarAmortizaciones = true;
            this.mostrarTablaCreditos = false;
            this.obtenerPagos(idCredito);
        },
        error: (error) => {
            this.toastr.error('No se pudieron obtener las amortizaciones. Inténtelo de nuevo más tarde.', 'Error');
        }
    })

    //this.verificarCredito(idCredito);
  }


  // verificarCredito(idCredito: number) {
  //   this.idCreditoSeleccionado = idCredito;
  //   let amortizaciones = this.amortizacionesAct;
  //   let contador: number = 0;

  //   amortizaciones.forEach(am => {
  //     if (am.estatus === 4){
  //       contador++;
  //     }
  //   });

  //   console.log("Contador: " + contador);

  //   // if (amortizaciones.length === contador) {
  //   if (true) {
  //     this.creditoSeleccionado = this.creditosActivos.filter(credito => credito.idCredito === idCredito)[0];
  //     console.log(this.creditoSeleccionado);
  //   }
  // }

  
  aplicarPago() {
    const idPago = this.idPagoAAplicar;
    this.pagosService.aplicarPago(idPago).subscribe({
      next: (response: string) => {
        this.closeModalAplicar();
        this.toastr.success("El pago se aplicó con exito", 'Éxito');
        console.log("response: " + response);
      },
      error: (error) => {
        console.error('Error al registrar el pago:', error);
        if (error.error && error.error.message) {
          this.toastr.error(error.error.message, 'Error');
        } else {
          this.toastr.error('Ocurrió un error al registrar el pago. Por favor, inténtelo de nuevo.', 'Error');
        }
      }
    });
    this.obtenerPagos(this.idCreditoSeleccionado);
    this.obtenerAmortizaciones(this.idCreditoSeleccionado);
  }


  registrarPago() {
    if (this.pagoForm.valid) {
      const { idCredito, montoPago } = this.pagoForm.value;
      this.pagoAplicado.idCredito = this.idCreditoSeleccionado;
      this.pagoAplicado.montoPago = montoPago;
  
      // console.log("pagoAplicado: ");
      // console.log(this.pagoForm.value);
      // console.log(this.pagoAplicado);
  
      this.pagosService.registrarPago(this.pagoAplicado).subscribe({
        next: (response: string) => {
          this.pagoForm.patchValue({ montoPago: 0 });
          this.toastr.success(response, 'Éxito');  // Muestra el mensaje del servidor
          this.modalTitle = '';
          this.closeModal();
          this.obtenerPagos(this.idCreditoSeleccionado);
        },
        error: (error) => {
          console.error('Error al registrar el pago:', error);
        }
      });
    }
  }


  regresar() {
    this.mostrarAmortizaciones = false;
    this.mostrarTablaCreditos = true;
    this.mostrarPagos = false;
  }

  openModal() {
    this.modalTitle = 'Registrar Pago';

    const modalElement = this.elementRef.nativeElement.querySelector('#modalPago');
    if (modalElement) {
      const modalInstance = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modalInstance.show();
    }
  }

  openModalAplicar(idPago: number) {
    this.idPagoAAplicar = idPago;
    this.modalTitle = 'Aplicar Pago';

    const modalElement = this.elementRef.nativeElement.querySelector('#modalAplicar');
    if (modalElement) {
      const modalInstance = new (window as any).bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      modalInstance.show();
    }
  }
  onModalClose() {
    //this.pagoForm.reset();
  }

  closeModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#modalPago');
    if (modalElement) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    this.onModalClose();
}

closeModalAplicar() {
  const modalElement = this.elementRef.nativeElement.querySelector('#modalAplicar');
  if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
          modalInstance.hide();
      }
  }
  this.onModalClose();
}

getStatusClass(status: number): string {
  switch (status) {
    case 1:
      return 'pending-status';
    case 2:
      return 'running-status';
    case 3:
      return 'moratorium-status';
    case 4:
      return 'paid-status';
    default:
      return '';
  }
}
}
