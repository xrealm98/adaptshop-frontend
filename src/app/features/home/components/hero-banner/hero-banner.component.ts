import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { register } from 'swiper/element/bundle';
import { HomeBanner } from '../../../../models/settings.model';

register();

@Component({
  selector: 'app-hero-banner',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.css',
})
export class HeroBannerComponent {
  swiperRef = viewChild<ElementRef<SwiperContainer>>('swiperRef');
  banners = input<HomeBanner[]>([]);

  constructor() {
    effect(() => {
      const swiperEl = this.swiperRef()?.nativeElement;
      const currentBanners = this.banners();

      if (swiperEl && currentBanners.length > 0) {
        const params = {
          pagination: {
            clickable: true,
            dynamicBullets: true,
          },
          navigation: true,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          on: {
            realIndexChange: (swiper: any) => {
              swiper.pagination.update();
            },
          },
        };

        Object.assign(swiperEl, params);
        swiperEl.initialize();
      }
    });
  }
}
