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
import {Category} from '../../../model/category';
import {CategoryService} from '../../../services/category.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {RegisterCategoryComponent} from '../../pop-ups/category/register-category/register-category.component';
import {UpdateCategoryComponent} from '../../pop-ups/category/update-category/update-category.component';
import {Product} from '../../../model/product';
import {ProductService} from '../../../services/product.service';
import {RegisterProductComponent} from '../../pop-ups/product/register-product/register-product.component';
import {EditProductComponent} from '../../pop-ups/product/edit-product/edit-product.component';
import {CommonModule} from '@angular/common';
import {BrandComponent} from '../brand/brand.component';
import {AssignSupermarketComponent} from '../../pop-ups/assign-supermarket/assign-supermarket.component';
import {OverlayService} from '../../../services/overlay.service';
import {photosLink} from '../../forphotoslink/photoslink';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  private url = photosLink.apiUrl;
  products: Product[] = [];
  displayedColumns: string[] = ['productId', 'name', 'description', 'advertisement', 'brand', 'category','image', 'acciones'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  productService: ProductService = inject(ProductService);
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
    this.productService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.log("Error en consulta", err),  // Muestra el error
    });
    console.log(this.productService.list())
  }

  showConfirmation(idProduct: number) {
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
        this.productService.delete(idProduct).subscribe({
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
  openDialog(productId?: number): void {
    console.log('Dialogo: '+productId)
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: { id: productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.loadLista();
    });
  }
  openDialogAssign(productId?: number): void {
    console.log('Dialogo: '+productId)
    const dialogRef = this.dialog.open(AssignSupermarketComponent, {
      data: { id: productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.loadLista();
    });
  }
  openDialogRegister(): void {
    const dialogRef = this.dialog.open(RegisterProductComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.loadLista();
    });
  }

  openDialogBrand(): void {
    const dialogRef = this.dialog.open(BrandComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.loadLista();
    });
  }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    console.log('Buscando producto por nombre:', input);

    if (input) {
      this.productService.getProductsByName(input).subscribe({
        next: (dataCat: Product[]) => {
          console.log('Datos recibidos del servicio:', dataCat);
          this.dataSource.data = dataCat;
          console.log('DataSource actualizado:', this.dataSource.data);
        },
        error: (error) => {
          console.error('Error al buscar producto:', error);
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
    return `${this.url}/images/product/${imagePath}`;
  }
}
