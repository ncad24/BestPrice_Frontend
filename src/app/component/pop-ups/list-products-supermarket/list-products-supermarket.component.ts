import {Component, Inject, inject, ViewChild} from '@angular/core';
import {Product} from '../../../model/product';
import {ProductService} from '../../../services/product.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
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
import {ListproductsbysupermarketDto} from '../../../model/listproductsbysupermarket-dto';
import Swal from 'sweetalert2';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-list-products-supermarket',
  standalone: true,
  imports: [
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
    MatHeaderCellDef,
    FormsModule,
    NgIf
  ],
  templateUrl: './list-products-supermarket.component.html',
  styleUrl: './list-products-supermarket.component.css'
})
export class ListProductsSupermarketComponent {
  productsList: ListproductsbysupermarketDto[] = [];
  productService: ProductService = inject(ProductService);

  displayedColumns: string[] = ['productId', 'name', 'precio','image', 'acciones'];
  dataSource: MatTableDataSource<ListproductsbysupermarketDto> = new MatTableDataSource<ListproductsbysupermarketDto>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  route: Router = inject(Router);
  private dialog: MatDialog =  inject(MatDialog);

  constructor(@Inject(MAT_DIALOG_DATA) public data: {supermarketId: number}) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    console.log("Load Lista!");
    this.viewProducts();
  }

  viewProducts() {
    this.productService.getProductsBySupermarket(this.data.supermarketId).subscribe({
      next: (products) => {
        console.log('Productos del supermercado:', products);
        this.dataSource.data = products
      },
      error: (err) => console.error('Error al obtener productos:', err)
    });
  }

  getImageUrl(imagePath: string): string {
    return `http://localhost:8080/images/product/${imagePath}`;
  }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    console.log('Buscando producto por nombre:', input);

    if (input) {
      this.productService.getProductsBySupermarketByProductName(this.data.supermarketId, input).subscribe({
        next: (dataCat: ListproductsbysupermarketDto[]) => {
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
      this.viewProducts();
    }
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
        this.productService.unassignToSupermarket(idProduct, this.data.supermarketId).subscribe({
          next: () => {
            this.viewProducts();
            Swal.fire(
              'Desasignado',
              'El producto ha sido desasignado.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire(
              'Error',
              'Hubo un problema al desasignar el producto.',
              'error'
            );
          },
          complete: () => {
            console.log("Desasignación completada");
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

  confirmPriceChange(product: ListproductsbysupermarketDto) {
    Swal.fire({
      title: '¿Confirmar cambio de precio?',
      text: `¿Deseas guardar el nuevo precio de ${product.productPrice}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.savePriceChange(product);
      } else {
        // Optionally, revert price if the user cancels
        this.viewProducts();
      }
    });
  }

  savePriceChange(product: ListproductsbysupermarketDto) {
    this.productService.updateProductPrice(product.productId, this.data.supermarketId, product.productPrice).subscribe({
      next: () => Swal.fire('Guardado', 'El precio ha sido actualizado.', 'success'),
      error: (err) => Swal.fire('Error', 'No se pudo actualizar el precio.', 'error')
    });
  }


  startEditing(element: any): void {
    element.editing = true;
    element.tempPrice = element.productPrice; // Guardamos el valor original en tempPrice
  }

  finishEditing(element: any): void {
    element.editing = false;

    // Solo confirmamos el cambio si el precio ha cambiado
    if (element.tempPrice !== element.productPrice) {
      element.productPrice = element.tempPrice;
      this.confirmPriceChange(element); // Llamamos a la función para confirmar el cambio
    }
  }


}
