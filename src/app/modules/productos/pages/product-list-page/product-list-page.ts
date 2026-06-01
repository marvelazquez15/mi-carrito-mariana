import { Component, OnInit, inject, signal,computed, viewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductTable } from '@modules/productos/components/product-table/product-table'

import   { ProductoService } from '@core/service/producto'
import { ApiResponse, ProductInterface, ProductRequest, ProductUpdate } from '@modules/productos/models/product.models'
import { ReactiveFormsModule, FormBuilder, Validators  } from '@angular/forms'
import { FormErrorService } from '@shared/services/form-error';
import { CategoryInterface } from '@modules/productos/models/category.models'
import { CategoryService } from '@core/service/category'
import { ToastService }from '@shared/services/toast';

@Component({
  selector: 'app-product-list-page',
  imports: [ReactiveFormsModule, ProductTable],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage implements OnInit {
  constructor(
    private router: Router, 
    private routerActivate: ActivatedRoute,
    private productService: ProductoService,
    private categoryService: CategoryService
  ){

    console.log("ProductListPage");
    console.log(this.routerActivate.snapshot.params['id2'])

  }

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private formErrorService = inject(FormErrorService);
  protected readonly editingId = signal<number | null>(null)
  public categories = signal<CategoryInterface[]>([]);

  public productForm = this.fb.nonNullable.group({
    name:['', [Validators.required,Validators.minLength(3)]],
    description:['', [Validators.required,Validators.minLength(5)]],
    price:[0, [Validators.required,Validators.minLength(0.01)]],
    stock:[0, [Validators.required,Validators.minLength(0)]],
    category:[0, [Validators.required,Validators.minLength(1)]],
    image_url:['', [Validators.required]]
  }
  )

  public readonly products = signal<ProductInterface[]>([])
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('ProductDialog')
  private readonly confirmDeleteDialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('confirmDeleteDialog');

  protected readonly pendingDeleteId = signal<number | null>(null);

  private readonly pageSize = 3
  protected readonly totalCount = signal(0)
  protected readonly currentPage = signal(1)
  protected readonly totalPages = signal(1)
  protected readonly hasNext = signal(false)
  protected readonly hasPrevious = signal(false)

  protected readonly pendingDeleteName = computed(() => {
    const id = this.pendingDeleteId();
    if (id === null) {
      return '';
    }
    return this.products().find((p) => p.id === id)?.name ?? `ID ${id}`;
  });


  public onEdit(id: number):void{

    const product = this.products().find((p) => p.id === id)
    if(!product){
      return
    }
    this.editingId.set(id)
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      category: product.category,
      image_url: product.image_url,
    })

    this.openCreateModal(true)

    console.log("Edicion del producto",id)
  }

  public onDelete(id: number):void{

    this.pendingDeleteId.set(id);
    queueMicrotask(() => this.confirmDeleteDialogRef().nativeElement.showModal());
  }

  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id === null) {
      return;
    }

    this.productService.deleteProduct(id).subscribe(() => {
      this.toastService.show("Producto Eliminado correctamente.","success")
      this.getAllProduct();
      this.closeConfirmDeleteModal();
    });
  }

  protected closeConfirmDeleteModal(): void {
    this.confirmDeleteDialogRef().nativeElement.close();
    this.pendingDeleteId.set(null);
  }

  protected onConfirmDeleteBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeConfirmDeleteModal();
    }
  }


  protected goToPreviousPage(): void{

    if(!this.hasPrevious()) return;
      this.currentPage.update((p) => Math.max(1, p - 1))
      this.getAllProduct(this.currentPage())

  }

  protected goToNextPage(): void{
    if(!this.hasNext()) return;
    this.currentPage.update((p) => p + 1)
    this.getAllProduct(this.currentPage())
  }





  private getAllProduct(page = this.currentPage()):void{

    this.productService.getAllProducts(page, this.pageSize)
    .subscribe((data:ApiResponse)=>{
      console.log(data.results)
      this.products.set(data.results?? [])

      this.totalCount.set(data.count ?? 0)
      this.currentPage.set(data.current_page ?? page)
      this.totalPages.set(data.total_pages ?? 1)
      this.hasNext.set(!!data.has_next)
      this.hasPrevious.set(!!data.has_previous)
    });
  }


  public ngOnInit():void{
    this.getAllProduct(1);
  }
  public modalTitle(): string{
    return this.editingId() ? 'Editar Producto': 'Nuevo producto'
  }

  public openCreateModal(isEdit:boolean): void{
   if (!isEdit) {
     this.editingId.set(null)
   }
    this.getAllCategory()
    queueMicrotask(() =>this.dialogRef().nativeElement.showModal());
  }

  public closeModal():void{
    this.dialogRef().nativeElement.close()
  }


  public onDialogBackdrop(event: MouseEvent): void{
    console.log("onDialogOpen")
    if(event.target === event.currentTarget){
      this.closeModal()
    }

    

  }

  public isFieldInvalid(field: string): boolean{
    const control = this.productForm.get(field)
  
    return !!(
      control && control.invalid && 
      (control.touched || control.dirty)
    )
  }

  public getFieldError(field: string): string | null{

    const control = this.productForm.get(field)
  
    return this.formErrorService.getFieldError(control)
  
  }


private getAllCategory(): void {
  this.categoryService.getAllCategories()
  .subscribe((data: any) => {
    console.log(data.results);
    this.categories.set(data.results ?? []);
  });
}




  public saveProduct(): void{

    if(this.productForm.invalid){
      return;
    }

    const payload = this.productForm.getRawValue()

    const id = this.editingId()
    if(id === null){
      
    this.productService.createProduct(payload as ProductRequest)
    .subscribe((reponse:ApiResponse) =>{

      this.getAllProduct();
      this.closeModal()

    })
    }else{

      const payload: ProductUpdate = {
        ...this.productForm.getRawValue(),
        created_by:1
      }

      this.productService.updateProduct(payload, id)
    .subscribe((reponse:ApiResponse) =>{

      this.getAllProduct();
      this.closeModal()

    })
    }

      
  }


  

}
