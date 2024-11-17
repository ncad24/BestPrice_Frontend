import { Component, Inject, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryService} from '../../../../services/category.service';
import {Category} from '../../../../model/category';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-register-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    NgIf,
    MatError,
    MatLabel,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './register-category.component.html',
  styleUrl: './register-category.component.css'
})
export class RegisterCategoryComponent {
  categoryForm: FormGroup;
  fb = inject(FormBuilder);
  categoryService: CategoryService = inject(CategoryService);
  dialogRef: MatDialogRef<RegisterCategoryComponent> = inject(MatDialogRef);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const category: Category = new Category();
      category.name = this.categoryForm.value.name;
      category.description = this.categoryForm.value.description;

      this.categoryService.insert(category).subscribe(() => {
        this.categoryService.list().subscribe(data => {
          this.categoryService.setList(data);
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
}
