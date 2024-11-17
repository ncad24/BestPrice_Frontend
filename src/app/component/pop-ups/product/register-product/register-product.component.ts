import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryService} from '../../../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../../../model/category';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../model/product';
import {MatOption, MatSelect} from '@angular/material/select';
import {Brand} from '../../../../model/brand';
import {NgForOf, NgIf} from '@angular/common';
import {BrandService} from '../../../../services/brand.service';
import {ProductclickService} from '../../../../services/productclick.service';

@Component({
  selector: 'app-register-product',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './register-product.component.html',
  styleUrl: './register-product.component.css'
})
export class RegisterProductComponent {
  productForm: FormGroup;
  fb = inject(FormBuilder);
  productService: ProductService = inject(ProductService);
  productClickService: ProductclickService = inject(ProductclickService);
  dialogRef: MatDialogRef<RegisterProductComponent> = inject(MatDialogRef);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  registerError: string = '';
  selectedImage?: File;

  brandService: BrandService = inject(BrandService);
  categoryService: CategoryService = inject(CategoryService);

  selectBrand: Brand = {brandId: 0, name: ''}
  selectBrandId: number | null = null;

  selectCategory: Category = {categoryId: 0, name:'',description:''}
  selectCategoryId: number | null = null;

  brandList: Brand[] = [];
  categoryList: Category[] = [];

  fileName: string = '';

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      advertisement: ['', Validators.required],
      imagePath: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = new Product();
      product.name = this.productForm.value.name;
      product.description = this.productForm.value.description;
      product.advertisement = this.productForm.value.advertisement;
      product.imagePath = this.productForm.value.imagePath;
      product.brand = this.productForm.value.brand;
      product.category = this.productForm.value.category;

      const formData = new FormData();
      formData.append('name', product.name.toString());
      formData.append('description', product.description.toString());
      formData.append('advertisement', product.advertisement.toString());
      formData.append('brand', product.brand.toString());
      formData.append('category', product.category.toString());
      if (this.selectedImage) {
        formData.append('image', this.selectedImage, this.selectedImage.name);
      }
      this.productService.insert(formData).subscribe(() => {
        this.productService.list().subscribe(data => {
          this.productClickService.insert(product.name.toString()).subscribe({
            next: () => {
              console.log('Producto registrado correctamente en clics');
            },
            error: (error) => {
              console.error('Error al registrar el clic del producto:', error);
            },
          });
          console.log(data)
          this.productService.setList(data);
        });
        this.dialogRef.close();
      });

    } else{
      console.log("Formulario no valido")
    }

  }

  onSelectBrand(): void {
    this.selectBrand = this.brandList.find(brand => brand.brandId == this.selectBrandId)  || {brandId: 0, name: ''};
  }

  onSelectCategory(): void {
    this.selectCategory = this.categoryList.find(category => category.categoryId == this.selectCategoryId) || {categoryId: 0, name:'',description:''};
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
