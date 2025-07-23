export interface OrganizationChart {
  id: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationChartRequest {
  imageUrl: string;
  isActive?: boolean;
}

export interface UpdateOrganizationChartRequest {
  imageUrl?: string;
  isActive?: boolean;
}

export interface OrganizationChartStats {
  total: number;
  active: number;
  inactive: number;
}

export interface OrganizationChartState {
  organizationCharts: OrganizationChart[];
  activeChart: OrganizationChart | null;
  loading: boolean;
  error: string | null;
}
