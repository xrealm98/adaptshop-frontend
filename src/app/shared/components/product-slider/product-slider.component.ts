import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { LoadingService } from '../../../core/services/loading/loading.service';
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
  private loadingService = inject(LoadingService);
  @ViewChild('swiperRef') swiperRef!: ElementRef<any>;
  isLoading = this.loadingService.isLoading;

  ngAfterViewInit() {
    const swiperEl = this.swiperRef?.nativeElement;

    if (!swiperEl) return;

    const swiperParams: SwiperOptions = {
      slidesPerView: 'auto',
      spaceBetween: 24,
      navigation: true,
      pagination: false,
      grabCursor: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      a11y: {
        enabled: true,
        containerMessage: `Carrusel de ${this.title}. Usa las flechas izquierda y derecha para navegar entre productos.`,
        prevSlideMessage: 'Ver producto anterior',
        nextSlideMessage: 'Ver producto siguiente',
      },
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }

  ngOnDestroy() {
    const swiperEl = this.swiperRef?.nativeElement;
    if (swiperEl && swiperEl.swiper) {
      swiperEl.swiper.destroy(true, true);
    }
  }
}
