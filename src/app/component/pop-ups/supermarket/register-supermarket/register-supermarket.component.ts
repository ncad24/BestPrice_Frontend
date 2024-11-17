import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {BrandService} from '../../../../services/brand.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Brand} from '../../../../model/brand';
import {SupermarketService} from '../../../../services/supermarket.service';
import {Supermarket} from '../../../../model/supermarket';

@Component({
  selector: 'app-register-supermarket',
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
  templateUrl: './register-supermarket.component.html',
  styleUrl: './register-supermarket.component.css'
})
export class RegisterSupermarketComponent {
  supermarketForm: FormGroup;
  fb = inject(FormBuilder);
  supermarketService: SupermarketService = inject(SupermarketService);
  dialogRef: MatDialogRef<RegisterSupermarketComponent> = inject(MatDialogRef);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  selectedImage?: File;

  constructor() {
    this.supermarketForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imagePath: [''],
    });
  }

  onSubmit(): void {
    if (this.supermarketForm.valid) {
      const supermarket: Supermarket = new Supermarket();
      supermarket.name = this.supermarketForm.value.name;
      supermarket.description = this.supermarketForm.value.description;

      this.supermarketService.insert(supermarket).subscribe(() => {
        this.supermarketService.list().subscribe(data => {
          this.supermarketService.setList(data);
        });
        this.dialogRef.close();
      });
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
