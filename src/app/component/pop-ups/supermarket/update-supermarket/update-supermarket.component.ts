import {Component, Inject, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SupermarketService} from '../../../../services/supermarket.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Supermarket} from '../../../../model/supermarket';
import {EditProductComponent} from '../../product/edit-product/edit-product.component';
import {Product} from '../../../../model/product';

@Component({
  selector: 'app-update-supermarket',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule
    ],
  templateUrl: './update-supermarket.component.html',
  styleUrl: './update-supermarket.component.css'
})
export class UpdateSupermarketComponent {
  supermarketForm: FormGroup;
  fb = inject(FormBuilder);
  supermarketService: SupermarketService = inject(SupermarketService);
  dialogRef: MatDialogRef<EditProductComponent> = inject(MatDialogRef);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  selectedImage?: File;
  id: number = 0;
  registerError: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number }) {
    this.supermarketForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imagePath: ['']
    });
  }

  ngOnInit():void{
    this.id = this.data.id;
    this.cargarForm();
  }

  cargarForm(): void {
    this.supermarketService.listId(this.id).subscribe((data: Product) =>{

      this.supermarketForm.patchValue({
        name: data.name,
        description: data.description,
        // imagePath: data.imagePath,
      })
    })
  }

  onSubmit(): void {
    if (this.supermarketForm.valid) {
      const supermarket: Supermarket = {
      supermarketId: this.id,
      name: this.supermarketForm.value.name,
      description: this.supermarketForm.value.description,
      imagePath: this.selectedImage ? this.selectedImage.name : this.supermarketForm.value.imagePath
      };
      this.supermarketService.update(supermarket).subscribe({
        next: (data: any) => {
          this.supermarketService.list().subscribe((data:any) => {
            this.supermarketService.setList(data);
          });
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error al actualizar el producto', error);
          this.registerError = 'Ocurrió un error al actualizar el producto.';
        }
      })
    } else{
      console.log("Formulario no valido")
    }

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any){
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }
}
