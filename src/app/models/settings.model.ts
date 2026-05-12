export interface AppSettings {
  footer?: FooterSettings;
  site?: SiteSettings;
}

export interface FooterSettings {
  phone: string;
  email: string;
  faq_url: string;
  about_url: string;
  legal_url: string;
  privacy_url: string;
}

export interface SiteSettings {
  name: string;
}
