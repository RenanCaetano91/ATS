export interface Candidate {
    id: number;
    name: string;
    email: string;
    phone: string;
    appliedJobId: number;
    status: string;
    resume?: File;
  }
  