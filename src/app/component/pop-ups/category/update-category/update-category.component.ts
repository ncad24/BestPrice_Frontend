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
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.css'
})
export class UpdateCategoryComponent {
  categoryForm: FormGroup;
  fb = inject(FormBuilder);
  router: Router = inject(Router)
  categoryService: CategoryService = inject(CategoryService);
  dialogRef: MatDialogRef<UpdateCategoryComponent> = inject(MatDialogRef);
  edicion: boolean = false;
  id: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number }) {
    this.categoryForm = this.fb.group({
      categoryId: [''],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = this.data.id;
    console.log('ID recibido: ' + this.id);
    this.edicion = this.id != null;
    this.cargarForm();

  }

  cargarForm(): void {
    if (this.edicion) {
      this.categoryService.listId(this.id).subscribe((data: Category) => {
        console.log('Datos de la categoría: ', data);
        this.categoryForm.patchValue({
          name: data.name,
          description: data.description
        });
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const category: Category = new Category();
      category.categoryId = this.id;
      category.name = this.categoryForm.value.name;
      category.description = this.categoryForm.value.description;

      this.categoryService.update(category).subscribe(() => {
        this.categoryService.list().subscribe(data => {
          this.categoryService.setList(data);
        });
        this.dialogRef.close();
      });
    }

  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
