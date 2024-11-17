import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SupermarketService} from '../../../services/supermarket.service';
import {ProductService} from '../../../services/product.service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-assign-supermarket',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    MatButton
  ],
  templateUrl: './assign-supermarket.component.html',
  styleUrl: './assign-supermarket.component.css'
})
export class AssignSupermarketComponent {
  productId: number = 0;
  supermarkets: any[] = []; // Lista de supermercados
  selectedSupermarket: any = null;
  price: number;
  public dialogRef: MatDialogRef<AssignSupermarketComponent> = inject(MatDialogRef);
  private supermarketService: SupermarketService = inject(SupermarketService);
  private productService: ProductService = inject(ProductService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number }) {}

  ngOnInit(): void {
    this.productId = this.data.id;
    console.log('ProductId:', this.productId);
    this.supermarketService.list().subscribe({
      next: (data) => (this.supermarkets = data),
      error: (err) => console.error('Error al cargar supermercados:', err),
    });
  }

  onAssign() {
    console.log('Selected Supermarket:', this.selectedSupermarket);
    console.log('SupermarketId:', this.selectedSupermarket.supermarketId);
    if (this.selectedSupermarket && this.price) {
      this.productService.assignToSupermarket(this.productId, this.selectedSupermarket.supermarketId, this.price)
        .subscribe({
          next: () => {
            console.log('Producto asignado exitosamente');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Error al asignar producto:', err),
        });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
