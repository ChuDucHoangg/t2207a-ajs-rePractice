import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: { id: number; name: string; price: number }[] = [];

  newProduct = { name: '', price: 0 };
  selectedProduct: { id?: number; name: string; price: number } = {
    id: undefined,
    name: '',
    price: 0,
  };
  isAddProductFormVisible = false;
  editProductModal: bootstrap.Modal | undefined;

  ngOnInit() {
    this.loadProducts();
  }

  toggleAddProductForm() {
    this.isAddProductFormVisible = !this.isAddProductFormVisible;
  }

  //save product to local storage
  saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    } else {
        //base list products
      this.products = [
        { id: 1, name: 'Product one', price: 100 },
        { id: 2, name: 'Product two', price: 150 },
        { id: 3, name: 'Product Three', price: 200 },
      ];
    }
  }

  //hanlde add product
  addProduct() {
    if (this.newProduct.name && this.newProduct.price > 0) {
      const newId = this.products.length > 0 
        ? Math.max(...this.products.map(p => p.id)) + 1 
        : 1;
      this.products.push({ id: newId, ...this.newProduct });
      this.newProduct = { name: '', price: 0 };
      this.isAddProductFormVisible = false;
      this.saveToLocalStorage();
    }
  }

  openEditModal(product: any, modalElement: HTMLElement) {
    if (!product) {
      console.error('Invalid product for editing');
      return;
    }
    this.selectedProduct = { ...product };
    this.editProductModal = new bootstrap.Modal(modalElement, {});
    this.editProductModal.show();
  }

  //hanlde edit product
  saveProduct() {
    if (this.selectedProduct.id === undefined) {
      console.error('Product ID is undefined. Cannot update product.');
      return;
    }

    const index = this.products.findIndex(
      (p) => p.id === this.selectedProduct.id
    );

    if (index !== -1) {
      this.products[index] = {
        id: this.selectedProduct.id,
        name: this.selectedProduct.name,
        price: this.selectedProduct.price,
      };
    }
    this.editProductModal?.hide();
    this.saveToLocalStorage();
  }

  confirmDelete(product: { id: number; name: string; price: number }) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the product "${product.name}"?`
    );

    if (confirmed) {
      this.deleteProduct(product.id);
    }
  }

  //hanlde delete product
  deleteProduct(productId: number) {
    this.products = this.products.filter((product) => product.id !== productId);
    this.saveToLocalStorage();
  }
}
