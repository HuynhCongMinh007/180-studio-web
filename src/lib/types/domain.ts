export type Id = number;

export interface AssetRef {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface SiteLogo {
  url: string;
  publicId?: string;
}

export interface HomeSlide {
  id: Id;
  image: AssetRef;
  position: number;
}
