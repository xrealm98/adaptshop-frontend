import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { register } from 'swiper/element/bundle';
import { getOptimizedSrc, getOptimizedSrcset } from '../../../../core/utils/image.utils';
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

  getOptimizedSrc = getOptimizedSrc;
  getOptimizedSrcset = getOptimizedSrcset;

  private proxyUrl = 'https://wsrv.nl/';

  private document = inject(DOCUMENT);
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

      if (currentBanners && currentBanners.length > 0) {
        const firstImageUrl = currentBanners[0].image;
        this.injectDynamicPreload(firstImageUrl);
      }
    });
  }

  private injectDynamicPreload(imageUrl: string) {
    if (!imageUrl) return;

    const link = this.document.createElement('link');
    link.id = 'dynamic-lcp-preload';
    link.rel = 'preload';
    link.as = 'image';
    link.imageSizes = '100vw';
    link.setAttribute('fetchpriority', 'high');

    link.imageSrcset = this.getOptimizedSrcset(imageUrl);

    this.document.head.appendChild(link);
  }
}
