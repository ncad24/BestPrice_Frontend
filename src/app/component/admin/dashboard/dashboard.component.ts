import {Component, inject, OnInit} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {Chart, ChartData, ChartDataset, ChartOptions, ChartType, registerables} from 'chart.js';
Chart.register(...registerables);
import {Product} from '../../../model/product';
import {MatLabel} from '@angular/material/form-field';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ProductclickService} from '../../../services/productclick.service';
import {Productclick} from '../../../model/productclick';
import {ProductService} from '../../../services/product.service';
import {PricesByProductSupermarket} from '../../../model/prices-by-product-supermarket';
import {ProductpriceDto} from '../../../model/productprice-dto';
import {BrandService} from '../../../services/brand.service';
import {SupermarketService} from '../../../services/supermarket.service';
import {UserAppService} from '../../../services/user-app.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  // Propiedades para almacenar los conteos
  totalProductsBySupermarket: number = 0;
  totalBrands: number = 0;
  totalSupermarkets: number = 0;
  totalUsers: number = 0;
  // Configuración para el gráfico de barras
  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  public barChartLabels: string[] = [];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Clicks',
        backgroundColor: '#33A0FF',
      },
    ],
  };
  public barChartType: ChartType = 'bar';

  // Configuración para el gráfico de barras horizontales de precios
  public priceChartOptions: ChartOptions = {
    responsive: true,
    indexAxis: 'y', // Hace que el gráfico de barras sea horizontal
    plugins: {
      legend: { position: 'top' }
    }
  };
  public priceChartLabels: string[] = [];
  public priceChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Precio',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FFC107'],
      },
    ],
  };
  public priceChartType: ChartType = 'bar';

  // Inyectar servicios
  private productClickService: ProductclickService = inject(ProductclickService);
  private productPriceService: ProductService = inject(ProductService);
  private brandService: BrandService = inject(BrandService);
  private supermarketService: SupermarketService = inject(SupermarketService);
  private userService: UserAppService = inject(UserAppService);

  constructor() {}

  ngOnInit(): void {
    this.loadTopClickedProducts();
    this.loadTopPriceProducts();
    this.countTotalProductsBySupermarket();
    this.countTotalBrand();
    this.countTotalSupermarket();
    this.countTotalUser();
  }
  // Cargar datos para el gráfico de barras
  loadTopClickedProducts(): void {
    this.productClickService.listTopId().subscribe({
      next: (data: Productclick[]) => {
        console.log('Datos recibidos:', data);
        // Actualiza las etiquetas y los datos del gráfico
        this.barChartData = {
          labels: data.map(product => product.name), // Asegúrate de que `name` exista
          datasets: [
            {
              data: data.map(product => product.clicks), // Asegúrate de que `clicks` exista
              label: 'Clicks',
              backgroundColor: '#42A5F5',
            },
          ],
        };
      },
      error: (error) => {
        console.error('Error al cargar los datos del gráfico:', error);
      }
    });
  }

  // Cargar datos para el gráfico de pastel
  loadTopPriceProducts(): void {
    this.productPriceService.getTop5LowestPriceProducts().subscribe({
      next: (data: ProductpriceDto[]) => {
        console.log('Datos recibidos para precios:', data);
        this.priceChartData = {
          labels: data.map(product => product.productName),
          datasets: [
            {
              data: data.map(product => product.price),
              label: 'Precio',
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FFC107'],
            },
          ],
        };
      },
      error: (error) => {
        console.error('Error al cargar los datos de precios:', error);
      }
    });
  }
  countTotalProductsBySupermarket() {
    this.productPriceService.countProductsBySupermarket().subscribe({
      next: (count: number) => {
        this.totalProductsBySupermarket = count;
      },
      error: (error) => {
        console.error('Error al contar los productos por supermercado:', error);
      }
    });
  }
  countTotalBrand() {
    this.brandService.getTotalBrands().subscribe({
      next: (count: number) => {
        this.totalBrands = count;
      },
      error: (error) => {
        console.error('Error al contar las marcas:', error);
      }
    });
  }
  countTotalSupermarket() {
    this.supermarketService.getSupermarketTotal().subscribe({
      next: (count: number) => {
        this.totalSupermarkets = count;
      },
      error: (error) => {
        console.error('Error al contar los supermercados:', error);
      }
    });
  }
  countTotalUser() {
    this.userService.getTotalUser().subscribe({
      next: (count: number) => {
        this.totalUsers = count;
      },
      error: (error) => {
        console.error('Error al contar los usuarios:', error);
      }
    });
  }
}
