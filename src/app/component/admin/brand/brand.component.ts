import {Component, inject, ViewChild} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Brand} from '../../../model/brand';
import {BrandService} from '../../../services/brand.service';
import Swal from 'sweetalert2';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    MatSort,
    MatSortHeader,
    MatButton,
    RouterLink,
    FormsModule
  ],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent {
  lista: Brand[] = [];
  dataSource: MatTableDataSource<Brand> = new MatTableDataSource<Brand>();
  brandService: BrandService = inject(BrandService);
  newBrand: Brand = new Brand();
  router: Router = inject(Router);
  isRegistering = false;
  isUpdating = false;
  isDeleting = false;
  selectedBrand: Brand = { brandId: 0, name: ''};
  selectedBrandId: number | null = null;

  registerError: string = '';

  private dialog: MatDialog = inject(MatDialog);

  constructor(){
    console.log("Load constructor");
  }

  ngOnInit(): void {
    console.log("Load Lista!");
    this.loadLista();
  }

  loadLista(): void {
    this.brandService.list().subscribe({
      next: (data) => {
        this.lista = data;
        this.dataSource.data = data;
      },
      error: (err) => console.log("Error en consulta", err),
    });
  }

  showConfirmation(idBrand: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, adelante',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.brandService.delete(idBrand).subscribe({
          next: () => {
            // Elimina la categoría de la lista
            this.loadLista(); // Recarga la lista para reflejar los cambios
            Swal.fire(
              'Eliminado',
              'La marca ha sido eliminada.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la marca.',
              'error'
            );
          },
          complete: () => {
            console.log("Eliminación completada");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Tu acción ha sido cancelada.',
          'error'
        );
      }
    });
  }

  showRegisterForm(): void {
    this.isRegistering = true;
    this.isUpdating = false;
    this.isDeleting = false;
  }

  showUpdateForm(): void {
    this.isUpdating = true;
    this.isRegistering = false;
    this.isDeleting = false;
  }

  showDeleteForm(): void {
    this.isDeleting = true;
    this.isRegistering = false;
    this.isUpdating = false;
  }

  goBack(): void {
    this.isRegistering = false;
    this.isUpdating = false;
    this.isDeleting = false;
  }

  onSelectBrand(): void {
    this.selectedBrand = this.lista.find(brand => brand.brandId === this.selectedBrandId) || { brandId: 0, name: ''};
  }

  registerBrand() {
    this.brandService.insert(this.newBrand).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response)
          this.loadLista();
          this.goBack();
        },
        error: (err) => {
          if (err.error && err.error.message){
            this.registerError = 'La marca ya existe'
          }else{
            this.registerError = 'Error en el registro. Inténtalo de nuevo.'
          }
        }
      });
  }

  updateBrand(): void {
    if (this.selectedBrand.brandId && this.selectedBrand.name) {
      this.brandService.update(this.selectedBrand).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'La marca ha sido actualizada.', 'success');
          this.loadLista();
          this.goBack();
        },
        error: (err) => Swal.fire('Error', 'Hubo un problema al actualizar la marca.', 'error')
      });
    }
  }

  confirmDelete(): void {
    if (this.selectedBrandId) {
      this.showConfirmation(this.selectedBrandId);
    }
  }

}
