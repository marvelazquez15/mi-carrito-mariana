import { Component, OnInit, inject, signal,computed, viewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductTable } from '@modules/productos/components/product-table/product-table'

import   { ProductoService } from '@core/service/producto'
import { ApiResponse, ProductInterface} from '@modules/productos/models/product.models'

import { ProductCell } from '@shared/components/product-cell/product-cell';

import { ToastService }from '@shared/services/toast';

import { CartService }from '@core/service/cart';





@Component({
  selector: 'app-tienda',
  imports: [ProductCell],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class Tienda implements OnInit {
  private productoService = inject(ProductoService);
  private toastService = inject(ToastService);
  protected readonly products = signal<ProductInterface[]>([]);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);


  private readonly pageSize = 3
  protected readonly totalCount = signal(0)
  protected readonly currentPage = signal(1)
  protected readonly totalPages = signal(1)
  protected readonly hasNext = signal(false)
  protected readonly hasPrevious = signal(false)


  protected addToCart(product: ProductInterface): void{

    this.cartService.getCurrentCart().subscribe((cart) => {
      this.cartService.addItem(cart.id, { product_id: product.id, quantity: 1 })
        .subscribe(() => {
          this.toastService.show(`${product.name} agregado al carrito`, 'success');
          this.router.navigate(['/carrito']);
        });
    });

  }

  protected goToPreviousPage(): void {
    if (!this.hasPrevious()) return;
    this.currentPage.update((p) => Math.max(1, p - 1));
    this.loadProducts(this.currentPage());
  }

  protected goToNextPage(): void {
    if (!this.hasNext()) return;
    this.currentPage.update((p) => p + 1);
    this.loadProducts(this.currentPage());
  }


  private loadProducts(page: number): void {
    this.productoService.getAllProducts(page, this.pageSize).subscribe((response: ApiResponse) => {
      this.products.set(response.results ?? []);
      this.totalCount.set(response.count ?? 0);
      this.currentPage.set(response.current_page ?? page);
      this.totalPages.set(response.total_pages ?? 1);
      this.hasNext.set(!!response.has_next);
      this.hasPrevious.set(!!response.has_previous);
    });
  }


  public ngOnInit(): void {
    this.loadProducts(1);
  }


}
