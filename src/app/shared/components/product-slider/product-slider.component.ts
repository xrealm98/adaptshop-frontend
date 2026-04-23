import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Product } from '../../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';

register();
@Component({
  selector: 'app-product-slider',
  imports: [ProductCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-slider.component.html',
  styleUrl: './product-slider.component.css',
})
export class ProductSliderComponent {
  @Input({ required: true }) title: string = '';
  @Input({ required: true }) products: Product[] = [];
}
