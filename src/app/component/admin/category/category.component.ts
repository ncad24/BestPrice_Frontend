import {Component, inject, ViewChild} from '@angular/core';
import {Category} from '../../../model/category';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {CategoryService} from '../../../services/category.service';
import {Router, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatButton, MatButtonModule} from '@angular/material/button';
import Swal from 'sweetalert2';
import {AuthService} from '../../../services/auth.service';
import {HttpHeaders} from '@angular/common/http';
import {RegisterCategoryComponent} from '../../pop-ups/category/register-category/register-category.component';
import {MatDialog} from '@angular/material/dialog';
import {UpdateCategoryComponent} from '../../pop-ups/category/update-category/update-category.component';
import {NavbarComponent} from '../../navbar/navbar.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    MatTable,
    MatPaginator,
    DatePipe,
    MatSort,
    MatSortHeader,
    MatColumnDef,
    MatHeaderRowDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatButton,
    MatButtonModule,
    RouterLink,
    MatHeaderCellDef,
    MatCellDef,
    NavbarComponent
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categories: Category[] = [];
  displayedColumns: string[] = ['categoryID', 'nameCategory', 'descriptionCategory', 'acciones'];
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  categoryService: CategoryService = inject(CategoryService);
  route: Router = inject(Router);
  private dialog: MatDialog =  inject(MatDialog);
  constructor(){
    console.log("Load constructor");
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    console.log("Load Lista!");
    this.loadLista();
  }

  loadLista(): void {
    this.categoryService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.log("Error en consulta", err),  // Muestra el error
    });
  }

  showConfirmation(idCategory: number) {
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
        this.categoryService.delete(idCategory).subscribe({
          next: () => {
            // Elimina la categoría de la lista
            this.loadLista(); // Recarga la lista para reflejar los cambios
            Swal.fire(
              'Eliminado',
              'La categoría ha sido eliminada.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la categoría.',
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
  openDialogRegister(): void {
    const dialogRef = this.dialog.open(RegisterCategoryComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.loadLista();
    });
  }

  openDialog(categoryId?: number): void {
    console.log('Dialogo: '+categoryId)
    const dialogRef = this.dialog.open(UpdateCategoryComponent, {
      data: { id: categoryId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.loadLista();
    });
  }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    console.log('Buscando categoría por nombre:', input);

    if (input) {
      this.categoryService.listName(input).subscribe({
        next: (dataCat: Category[]) => {
          console.log('Datos recibidos del servicio:', dataCat);
          this.dataSource.data = dataCat;
          console.log('DataSource actualizado:', this.dataSource.data);
        },
        error: (error) => {
          console.error('Error al buscar categoría:', error);
        },
        complete: () => {
          console.log('Búsqueda completada.');
        }
      });

    } else {
      this.loadLista();
    }
  }
}
