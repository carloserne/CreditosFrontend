import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ToastrService } from 'ngx-toastr';
import { SimuladorService } from '../../services/simulador.service';
import { ISimulador } from '../../interfaces/simulador';

@Component({
    selector: 'app-simulador-vista',
    standalone: true,
    imports: [
        CommonModule, 
        ReactiveFormsModule
    ],
    templateUrl: './simulador-vista.component.html',
    styleUrls: ['./simulador-vista.component.scss']
})
export class SimuladorVistaComponent implements OnInit {
    simuladorForm: FormGroup;
    mostrarTabla: boolean = false;
    datosSimulador: ISimulador | null = null;

    constructor(private fb: FormBuilder, private toastr: ToastrService, private simuladorService: SimuladorService) {
        this.simuladorForm = this.fb.group({
            metodo: [''],
            submetodo: [''],
            monto: [''],
            numpagos: [null],
            formaPago: [''],
            fechaInicio: [''],
            interesAnual: [null],
            iva: [{ value: 16, disabled: true }],
            ivaExento: [false],
            catValor: ['']
        });
    }

    ngOnInit(): void {}

    simular() {
        this.mostrarTabla = true;
        // this.simuladorService.calcularSimulador().subscribe(
        //     (data: ISimulador) => {
        //         this.datosSimulador = data;
        //         this.mostrarTabla = true;
        //     },
        //     (error) => {
        //         this.toastr.error(error.message, 'Error en la Simulación');
        //     }
        // );
    }

    limpiar() {
        this.simuladorForm.reset({
            metodo: '',
            submetodo: '',
            monto: '',
            numpagos: null,
            formaPago: '',
            fechaInicio: '',
            interesAnual: null,
            iva: 16,
            ivaExento: false,
            catValor: ''
        });
        this.toastr.info('Los campos se han limpiado.', 'Formulario Limpio');
    }
}
