export interface Mission {
  id: string;
  name: string;
  date: string;
  agency: string;
  type: 'launch' | 'landing' | 'flyby' | 'orbit' | 'sample_return' | 'crewed';
  description: string;
  status: 'completed' | 'ongoing' | 'planned' | 'failed';
  target?: string;
  crew?: string[];
  image?: string;
  details?: string;
  rocket?: string;
  launchSite?: string;
  missionPatch?: string;
  success?: boolean;
}

export interface LaunchData {
  id: string;
  name: string;
  date_utc: string;
  details: string;
  success: boolean;
  rocket: {
    name: string;
  };
  launchpad: {
    name: string;
    full_name: string;
  };
  links: {
    patch: {
      small: string;
      large: string;
    };
    flickr: {
      original: string[];
    };
    wikipedia: string;
  };
  crew?: Array<{
    name: string;
    agency: string;
  }>;
}