
export interface User {
  id: string;
  name: string;
  avatarColor: string;
  createdAt: string;
}

export interface ExtraIncome {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: string;
}

export interface HustleIdea {
  title: string;
  description: string;
  estimatedMonthly: string;
  difficulty: 'Facile' | 'Media' | 'Difficile';
  skillsRequired: string[];
}

export interface LiveGig {
  title: string;
  url: string;
  source: string;
  snippet: string;
}

export interface RoadmapStep {
  phase: string;
  action: string;
  expectedProfit: string;
  effort: string;
}

export interface Concorso {
  titolo: string;
  scadenza: string;
  ente: string;
  posti: string;
  link: string;
}

export interface ConcorsoReminder {
  id: string;
  titolo: string;
  scadenza: string;
  link?: string;
  notificato: boolean;
  priorita: 'Alta' | 'Media' | 'Bassa';
}

export interface SearchAlert {
  id: string;
  titoloStudio: string;
  regione: string;
  lastCheck: string;
  attivo: boolean;
}
