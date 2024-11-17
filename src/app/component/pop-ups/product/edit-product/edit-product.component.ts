import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../model/product';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Brand} from '../../../../model/brand';
import {Category} from '../../../../model/category';
import {BrandService} from '../../../../services/brand.service';
import {CategoryService} from '../../../../services/category.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  productForm: FormGroup;
  fb = inject(FormBuilder);
  router: Router = inject(Router);
  productService: ProductService = inject(ProductService);
  dialogRef: MatDialogRef<EditProductComponent> = inject(MatDialogRef);
  selectedImage?: File;
  id: number = 0;

  registerError: string = '';

  brandService: BrandService = inject(BrandService);
  categoryService: CategoryService = inject(CategoryService);

  selectBrand: Brand = {brandId: 0, name: ''}
  selectBrandId: number | null = null;

  selectCategory: Category = {categoryId: 0, name:'',description:''}
  selectCategoryId: number | null = null;

  brandList: Brand[] = [];
  categoryList: Category[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number }) {
    this.productForm = this.fb.group({
      productId: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      advertisement: ['', Validators.required],
      imagePath: [''],
      brand: ['', Validators.required],
      category: ['', Validators.required],
    })
  }

  ngOnInit():void{
    this.id = this.data.id;
    this.cargarForm();
    this.loadLista();
  }

  loadLista(): void {
    this.brandService.list().subscribe({
      next: (data: Brand[]) => {
        console.log("Lista de marcas Traida:", data);
        this.brandList = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
    this.categoryService.list().subscribe({
      next: (data: Category[]) => {
        console.log("Lista de categorías Traida:", data);
        this.categoryList = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  cargarForm(): void {
    this.productService.listId(this.id).subscribe((data: Product) =>{
      console.log('Datos del producto: ', data)
      this.selectBrandId = data.brand.brandId;
      this.selectCategoryId = data.category.categoryId;

      this.productForm.patchValue({
          name: data.name,
          description: data.description,
          advertisement: data.advertisement,
          // imagePath: data.imagePath,
          brand: data.brand,
          category: data.category
        })
    })
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = {
        productId: this.id,
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        advertisement: this.productForm.value.advertisement,
        imagePath: this.selectedImage ? this.selectedImage.name : this.productForm.value.imagePath,
        brand: this.brandList.find(brand => brand.brandId === this.productForm.value.brand) || this.selectBrand,
        category: this.categoryList.find(category => category.categoryId === this.productForm.value.category) || this.selectCategory
      };
      this.productService.update(product).subscribe({
        next: (data: any) => {
          this.productService.list().subscribe((data: any) => {
            this.productService.setList(data);
          });
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error al actualizar el producto', error);
          this.registerError = 'Ocurrió un error al actualizar el producto.';
        }
      });

    }
  }


  onSelectBrand(): void {
    this.selectBrand = this.brandList.find(brand => brand.brandId == this.selectBrandId)  || {brandId: 0, name: ''};
  }

  onSelectCategory(): void {
    this.selectCategory = this.categoryList.find(category => category.categoryId == this.selectCategoryId) || {categoryId: 0, name:'',description:''};
  }

  onFileSelected(event: any){
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
