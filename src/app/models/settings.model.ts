export interface AppSettings {
  footer?: FooterSettings;
  home?: HomeSettings;
  site?: SiteSettings;
}

// Footer
export interface FooterSettings {
  phone: string;
  email: string;
  faq_url: string;
  about_url: string;
  legal_url: string;
  privacy_url: string;
  footer_color: string;
  footer_text_color: string;
}

// Home
export interface HomeSettings {
  featured_category_id: number | null;
  category_buttons: HomeCategoryButton[];
  banners?: HomeBanner[];
}

export interface HomeBanner {
  title: string;
  subtitle: string;
  image: string;
  buttonText?: string;
}

export interface HomeCategoryButton {
  category_id: number;
  color: 'emerald' | 'sky' | 'orange' | 'slate' | 'purple' | 'rose';
}

// Site
export interface SiteSettings {
  name: string;
  header_color: string;
  header_text_color: string;
}
