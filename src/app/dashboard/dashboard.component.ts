import { Component, OnInit } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreditosService } from '../services/creditos.service';
import { ICredito } from '../interfaces/credito';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../services/dashboard.service';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [NgxChartsModule, CommonModule, ReactiveFormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    idEmpresa: number = 0;
    totalMes: number = 0;

    view: [number, number] = [700, 400];
    creditos: ICredito[] = [];
    pieData = [
        {
            "name": "Solicitados",
            "value": 0
        },
        {
            "name": "Firmados",
            "value": 0
        },
        {
            "name": "En curso",
            "value": 0
        },
        {
            "name": "Finalizados",
            "value": 0
        }
    ];

    amortizationData = [
        {
            "name": "Pendiente",
            "value": 0
        },
        {
            "name": "Corriendo",
            "value": 0
        },
        {
            "name": "Con Moratorios",
            "value": 0
        },
        {
            "name": "Pagada",
            "value": 0
        }
    ];

    paymentData = [
        {
            "name": "Cancelado",
            "value": 0
        },
        {
            "name": "Pendiente",
            "value": 0
        },
        {
            "name": "Pagado",
            "value": 0
        }
    ];

    constructor(
        private creditosService: CreditosService,
        private toastr: ToastrService,
        private dashboardService: DashboardService,
        private loginService: LoginService
    ) {}

    async ngOnInit(){
        await this.obtenerIDEmpresa();
    }

    showLegend = true;
    showLabels = true;
    explodeSlices = false;
    doughnut = false;

    colorScheme: Color = {
        name: 'cool',
        selectable: true,
        group: ScaleType.Ordinal,
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    obtenerIDEmpresa(){
        this.loginService.obtenerUsuario().subscribe(
            (data) => {
                console.log(data);
                this.idEmpresa = data?.idEmpresa || 0;
                this.obtenerCreditos();
                this.obtenerAmortizaciones(this.idEmpresa);
                this.obtenerPagos(this.idEmpresa);
                this.obtenerTotalMes(this.idEmpresa);
            },
            (error) => {
                this.toastr.error('No se pudieron obtener los datos de la empresa. Inténtelo de nuevo más tarde.', 'Error');
            }
        );
    }

    obtenerCreditos() {
        this.creditosService.getCreditos().subscribe({
            next: (creditos) => {
                this.creditos = creditos;
                this.actualizarPieData();
            },
            error: (error) => {
                this.toastr.error('No se pudieron obtener los créditos. Inténtelo de nuevo más tarde.', 'Error');
            }
        });
    }

    actualizarPieData() {
        const estatus1 = this.creditos.filter(credito => credito.estatus === 1).length;
        const estatus2 = this.creditos.filter(credito => credito.estatus === 2).length;
        const estatus3 = this.creditos.filter(credito => credito.estatus === 3).length;
        const estatus4 = this.creditos.filter(credito => credito.estatus === 4).length;

        this.pieData = [
            {
                "name": "Solicitados",
                "value": estatus1
            },
            {
                "name": "Firmados",
                "value": estatus2
            },
            {
                "name": "En curso",
                "value": estatus3
            },
            {
                "name": "Finalizados",
                "value": estatus4
            }
        ];
    }

    obtenerAmortizaciones(idEmpresa: number) {
        console.log(idEmpresa);
        this.dashboardService.getAmortizacionesPorEmpresa(idEmpresa).subscribe({
            next: (amortizaciones) => {
                console.log(amortizaciones);
                this.actualizarAmortizationData(amortizaciones);
            },
            error: (error) => {
                this.toastr.error('No se pudieron obtener las amortizaciones. Inténtelo de nuevo más tarde.', 'Error');
            }
        });
    }

    actualizarAmortizationData(amortizaciones: any[]) {
        const pendiente = amortizaciones.filter(amortizacion => amortizacion.estatus === 1).length;
        const corriendo = amortizaciones.filter(amortizacion => amortizacion.estatus === 2).length;
        const conMoratorios = amortizaciones.filter(amortizacion => amortizacion.estatus === 3).length;
        const pagada = amortizaciones.filter(amortizacion => amortizacion.estatus === 4).length;

        this.amortizationData = [
            {
                "name": "Pendiente",
                "value": pendiente
            },
            {
                "name": "Corriendo",
                "value": corriendo
            },
            {
                "name": "Con Moratorios",
                "value": conMoratorios
            },
            {
                "name": "Pagada",
                "value": pagada
            }
        ];
    }

    obtenerPagos(idEmpresa: number) {
        console.log(idEmpresa);
        this.dashboardService.getPagosPorEmpresa(idEmpresa).subscribe({
            next: (pagos) => {
                const cancelado = pagos.filter(pago => pago.estatus === 0).length;
                const pendiente = pagos.filter(pago => pago.estatus === 1).length;
                const pagado = pagos.filter(pago => pago.estatus === 2).length;

                this.paymentData = [
                    {
                        "name": "Cancelado",
                        "value": cancelado
                    },
                    {
                        "name": "Pendiente",
                        "value": pendiente
                    },
                    {
                        "name": "Pagado",
                        "value": pagado
                    }
                ];
            },
            error: (error) => {
                this.toastr.error('No se pudieron obtener los pagos. Inténtelo de nuevo más tarde.', 'Error');
            }
        });
    }

    obtenerTotalMes(idEmpresa: number) {
        this.dashboardService.getTotalPagos(idEmpresa).subscribe({
            next: (total) => {
                this.totalMes = total;
            },
            error: (error) => {
                this.toastr.error('No se pudieron obtener los totales. Inténtelo de nuevo más tarde.', 'Error');
            }
        })
    }
}
