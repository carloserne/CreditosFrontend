import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProducto } from '../../interfaces/producto';
import { ToastrService } from 'ngx-toastr';
import { ProductosService } from '../../services/productos.service';

declare let Swal: any;

@Component({
    selector: 'app-producto',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './producto.component.html',
    styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {
    modalTitle: string = '';
    modalRef: any;
    productoForm: FormGroup;
    productos: IProducto[] = [];
    allProductos: IProducto[] = [];

    constructor(
        private elementRef: ElementRef,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private productosService: ProductosService
    ) { 
        this.productoForm = this.fb.group({
            idProducto: [0],
            nombreProducto: ['', Validators.required],
            reca: [0, Validators.required],
            metodoCalculo: ['', Validators.required],
            subMetodo: ['', Validators.required],
            monto: [0, Validators.required],
            periodicidad: ['', Validators.required],
            numPagos: [0, Validators.required],
            interesAnual: [0, Validators.required],
            iva: [0, Validators.required],
            interesMoratorio: [0, Validators.required],
            aplicacionDePagos: ['', Validators.required],
            idEmpresa: [1],
            estatus: [1],
            detalleProducto: [[]]
        });
    }

    ngOnInit(): void {
        this.obtenerProductos();
    }

    openModal(mode: 'add' | 'edit', producto?: IProducto): void {
        this.modalTitle = mode === 'add' ? 'Agregar Producto' : 'Editar Producto';

        if (mode === 'add') {
            this.productoForm.reset({
                idProducto: 0,
                nombreProducto: '',
                reca: null,
                metodoCalculo: 'AMORTIZADO',
                subMetodo: '',
                monto: null,
                periodicidad: '',
                numPagos: null,
                interesAnual: null,
                iva: null,
                interesMoratorio: null,
                aplicacionDePagos: '',
                idEmpresa: 1,
                estatus: 1,
                detalleProducto: [{}]
            });
        } else if (mode === 'edit' && producto) {
            this.productoForm.patchValue({
                idProducto: producto.idProducto,
                nombreProducto: producto.nombreProducto,
                reca: producto.reca,
                metodoCalculo: producto.metodoCalculo,
                subMetodo: producto.subMetodo,
                monto: producto.monto,
                periodicidad: producto.periodicidad,
                numPagos: producto.numPagos,
                interesAnual: producto.interesAnual,
                iva: producto.iva,
                interesMoratorio: producto.interesMoratorio,
                aplicacionDePagos: producto.aplicacionDePagos,
                idEmpresa: producto.idEmpresa,
                estatus: producto.estatus,
                detalleProducto: producto.detalleProducto
            });
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

    obtenerProductos() {
        this.productosService.getProductos().subscribe({
            next: (productos) => {
                this.productos = productos;
                this.allProductos = [...productos];
            },
            error: (error) => {
                this.toastr.error('No se pudieron obtener los productos. Inténtelo de nuevo más tarde.', 'Error');
            }
        })
    }

    guardar(){
        console.log(this.productoForm.value);
        if(this.productoForm.invalid){
            this.toastr.error('Llena todos los campos.', 'Error');
            return;
        }

        let producto = this.productoForm.value;

        if(producto.idProducto === 0){
            producto.estatus = 1;
            producto.idEmpresa = 1;

            this.productosService.guardarProducto(producto).subscribe({
                next: () => {
                    this.toastr.success('Producto guardado con éxito', 'Guardado');
                    this.obtenerProductos();
                    this.closeModal();
                },
                error: (error) => {
                    this.toastr.error('No se pudo guardar el producto. Inténtelo de nuevo más tarde.', 'Error');
                }
            })
        }else{
            this.productosService.actualizarProducto(producto).subscribe({
                next: (response) => {
                    this.toastr.success('Producto actualizado con éxito', 'Actualizado');
                    this.obtenerProductos();
                    this.closeModal();
                },
                error: (error) => {
                    this.toastr.error('No se pudo actualizar el producto. Inténtelo de nuevo más tarde.', 'Error');
                }
            })
        }
    }

    async eliminar(producto: IProducto) {
        const result = await Swal.fire({
            title: '¿Eliminar producto?',
            text: "¿Estás seguro de eliminar este producto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            this.productosService.eliminarProducto(producto.idProducto).subscribe({
                next: () => {
                    this.toastr.success('Producto eliminado con éxito.', 'Eliminado');
                    this.obtenerProductos();
                },
                error: (error) => {
                    this.toastr.error('Error al eliminar el producto.', 'Error');
                }
            });
        }
    }

    closeModal() {
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
        this.productoForm.reset();
    }
}
