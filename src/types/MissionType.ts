export interface MissionType {
  id: string;
  name?: string;
  date_utc?: string;
  success?: boolean;
  details?: string;

  links?: {
    patch?: {
      small?: string;
    };
    flickr?: {
      original?: string[];
    };
    webcast?: string;
  };
}