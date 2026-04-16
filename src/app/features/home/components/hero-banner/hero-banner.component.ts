import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-hero-banner',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.css',
})
export class HeroBannerComponent {
  @ViewChild('swiperRef') swiperRef!: ElementRef<SwiperContainer>;
  banners = [
    {
      title: 'Nuevos productos Apple',
      subtitle: 'La revolución de la fotografía móvil ya está aquí.',
      image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2000',
      buttonText: 'Comprar ahora',
    },
    {
      title: 'Ofertas TOP de la semana',
      subtitle: 'Hasta 40% de descuento en periféricos seleccionados.',
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=2000',
      buttonText: 'Ver ofertas',
    },
    {
      title: 'Componentes PC',
      subtitle: 'Monta el PC de tus sueños con los mejores componentes',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2000',
      buttonText: 'Ver componentes',
    },
  ];
  ngAfterViewInit() {
    const swiperEl = this.swiperRef.nativeElement;

    const params = {
      pagination: {
        clickable: true,
        dynamicBullets: false,
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
}
