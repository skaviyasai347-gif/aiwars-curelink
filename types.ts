
export enum HealthCategory {
  GENERAL = 'General',
  PEDIATRIC = 'Pediatric',
  VACCINATION = 'Vaccination',
  EMERGENCY = 'Emergency',
  OUTBREAK = 'Outbreak'
}

export interface DiseaseInfo {
  name: string;
  description: string;
  symptoms: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  bedsAvailable: number;
  icuAvailable: number;
  oxygenStatus: 'Normal' | 'Limited' | 'Critical';
  distance: string;
  coordinates?: { lat: number; lng: number };
  uri?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'missed';
  ageGroup: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
