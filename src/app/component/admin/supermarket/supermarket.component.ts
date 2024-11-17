import {Component, inject, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {Supermarket} from '../../../model/supermarket';
import {SupermarketService} from '../../../services/supermarket.service';
import {RegisterSupermarketComponent} from '../../pop-ups/supermarket/register-supermarket/register-supermarket.component';
import {UpdateSupermarketComponent} from '../../pop-ups/supermarket/update-supermarket/update-supermarket.component';
import {Brand} from '../../../model/brand';
import {Product} from '../../../model/product';
import {ProductService} from '../../../services/product.service';
import {
  ListProductsSupermarketComponent
} from '../../pop-ups/list-products-supermarket/list-products-supermarket.component';

@Component({
  selector: 'app-supermarket',
  standalone: true,
    imports: [
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
      RouterLink
    ],
  templateUrl: './supermarket.component.html',
  styleUrl: './supermarket.component.css'
})
export class SupermarketComponent {
  lista: Supermarket[] = [];
  displayedColumns: string[] = ['supermarketId', 'nameSupermarket','description','image' ,'acciones'];
  dataSource: MatTableDataSource<Supermarket> = new MatTableDataSource<Supermarket>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  supermarketService: SupermarketService = inject(SupermarketService);

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
    this.supermarketService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.log("Error en consulta", err),  // Muestra el error
    });
  }

  showConfirmation(idSupermarket: number) {
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
        this.supermarketService.delete(idSupermarket).subscribe({
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
    const dialogRef = this.dialog.open(RegisterSupermarketComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.loadLista();
    });
  }

  openDialog(supermarketId?: number): void {
    const dialogRef = this.dialog.open(UpdateSupermarketComponent, {
      data: { id: supermarketId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.loadLista();
    });
  }

  openListProduct(supermarketId: number){
    const dialogRef = this.dialog.open(ListProductsSupermarketComponent, {
      data: {supermarketId}
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
      this.supermarketService.listName(input).subscribe({
        next: (dataCat: Supermarket[]) => {
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

  getImageUrl(imagePath: string): string {
    return `http://localhost:8080/images/supermarket/${imagePath}`;
  }

}
