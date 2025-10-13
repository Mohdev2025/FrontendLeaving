
  export interface Permission {
    id?: string;
    permissionType: 'before-work' | 'during-work' | 'leave-early';
    date: string;
    from: string;
    to: string;
    duration?: number; // optional
    reason?: string;
    status: string;
    userId?: string;
  }
  