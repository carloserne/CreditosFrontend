import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IUsuarioRol } from '../../interfaces/usuarioRol';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { IRol } from '../../interfaces/rol';
import { IUsuario } from '../../interfaces/usuario';
import { LoginService } from '../../services/login.service';

declare let Swal: any;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  usuarios: IUsuarioRol[] = [];
  roles: IRol[] = [];
  usuariosForm: FormGroup;
  modalTitle: string = '';
  passwordVisible: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;
  usuarioLogged: IUsuario | null = null;
  errorMessage: any;
  permiteAcciones: boolean = false;
  idUsuarioSeleccionado: any;
  isLoading: boolean = false;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;


  constructor(
    private usuariosService : UsuariosService,
    private rolService : RolesService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    private loginService: LoginService
  ) {
    this.usuariosForm = this.fb.group({
      idRol: [0],
      contrasenia: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      idEmpresa: [0],
      usuario1: ['', Validators.required],
      nombre: ['', Validators.required],
      imagen: [''],
  });

  }

  ngOnInit(): void {
    this.obtenerUsuarioLogeado();
    this.obtenerRoles();
    this.obtenerUsuarios();
    
  }


  //Metodos CRUD
  gestionarUsuario() {
    if (this.usuariosForm.invalid || !this.selectedImage) {
      this.toastr.warning('Debe llenar todos los campos y seleccionar una imagen.');
      return;
    }

    this.isLoading = true;

    let usuario: IUsuarioRol = this.usuariosForm.value;
    usuario.imagen = this.selectedImage.toString();
    usuario.idEmpresa = Number(this.usuarioLogged?.idEmpresa);

    //const accion = usuario.idUsuario ? 'actualizar' : 'guardar';
    const metodo = this.idUsuarioSeleccionado ? this.usuariosService.actualizarUsuario(this.idUsuarioSeleccionado, usuario) : this.usuariosService.guardarUsuario(usuario);

    metodo.subscribe({
      next: (res) => {
        const mensaje = this.idUsuarioSeleccionado ? 'Usuario actualizado correctamente' : 'Usuario agregado correctamente';
        this.toastr.success(mensaje, 'Éxito');
        this.obtenerUsuarios();
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        const mensajeError = usuario.idUsuario ? 'No se pudo actualizar el usuario.' : 'No se pudo agregar el usuario.';
        this.toastr.error(`${mensajeError} Inténtelo de nuevo más tarde.`, 'Error');
        this.isLoading = false;
      }
    });
}

  async eliminarUsuario(usuario: IUsuarioRol) {
    const result = await Swal.fire({
        title: '¿Eliminar usuario?',
        text: "¿Estás seguro de eliminar este usuario?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      if(this.usuarioLogged?.idRol == 1 && this.usuarioLogged?.nombre != usuario.nombre){
        this.usuariosService.eliminarUsuario(usuario.idUsuario).subscribe({
          next: () => {
              this.toastr.success('Usuario eliminado con éxito.', 'Eliminado');
              this.obtenerUsuarios();
          },
          error: (error) => {
              this.toastr.error('Error al eliminar el usuario.', 'Error');
          }
      });
      }else {
        this.toastr.error('No se puede eliminar el usuario si este es el usuario logueado.', 'Error');
      }
    }
  }

  //Metodos para obtener
  obtenerUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
        next: (usuarios) => {
            this.usuarios = usuarios;
        },
        error: (error) => {
            this.toastr.error('No se pudieron obtener los usuarios. Inténtelo de nuevo más tarde.', 'Error');
        }
    })
  }

  obtenerRoles() {
    this.rolService.getRoles().subscribe({
        next: (roles) => {
            this.roles = roles;
        },
        error: (error) => {
            this.toastr.error('No se pudieron obtener los pagos. Inténtelo de nuevo más tarde.', 'Error');
        }
    })
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.selectedImage = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

obtenerUsuarioLogeado() {
  
  this.loginService.obtenerUsuario().subscribe(
    (data) => {
        this.usuarioLogged = data;
    },
    (error) => {
        this.errorMessage = error;
    }
);
}

  //Funciones para abrir y cerrar el modal

  openModal(mode: 'add' | 'edit', usuario?: IUsuarioRol): void {

    if (mode === 'edit' && usuario) {
        //.log(mode, usuario);
        this.modalTitle = 'Editar usuario';
        this.idUsuarioSeleccionado = usuario.idUsuario;
        this.usuariosForm.patchValue({
            idRol: usuario.idRol,
            contrasenia: "",
            apellidoPaterno: usuario.apellidoPaterno,
            apellidoMaterno: usuario.apellidoMaterno,
            idEmpresa: usuario.idEmpresa,
            usuario1: usuario.usuario1,
            nombre: usuario.nombre,
            imagen: usuario.imagen
        });

        this.selectedImage = usuario.imagen;
    } else if (mode === 'add') {
        this.idUsuarioSeleccionado = null;
        this.modalTitle = 'Crear usuario';
        this.usuariosForm.reset();
        this.selectedImage = null;
    }

    const modal = new (window as any).bootstrap.Modal(
        this.elementRef.nativeElement.querySelector('#modalUsuario') as HTMLElement, {
            backdrop: 'static',
            keyboard: false
        }
    );
    modal.show();
}


  closeModal() {
    const modalElement = this.elementRef.nativeElement.querySelector('#modalUsuario');
        if (modalElement) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
        this.onModalClose();
  }

  onModalClose() {
    this.usuariosForm.reset();
        this.selectedImage = null;

        if (this.fileInput) {
            (this.fileInput.nativeElement as HTMLInputElement).value = '';
        }
  }

  //Otras funciones

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

}
