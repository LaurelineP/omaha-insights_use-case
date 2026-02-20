export interface CompanyData {
    company_id: string;
    name: string;
    description: string;
}

export interface StatData {
  company_id: number;
  is_financial: boolean;
  fiscal_year: number;
  estimated: boolean;
  economic_profit: number;
  rcr_perc_harm: number;
  RAGR: number;
}

export interface DashboadData {
    companies: CompanyData[]
    stats: StatData[] 
}