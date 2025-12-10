// src/types/api.ts
// mReport — Focused on SRHR & GBV Reporting (South Sudan)

export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

// Main report categories — we only care about these two
export type ReportType = 'srhr' | 'gbv';

// Subtypes for SRHR
export type SRHRSubtype =
  | 'maternal_health'
  | 'contraceptive'
  | 'hiv'
  | 'family_planning'
  | 'other_srhr';

// Subtypes for GBV
export type GBVSubtype =
  | 'physical_violence'
  | 'sexual_violence'
  | 'emotional_abuse'
  | 'economic_violence'
  | 'fgm'
  | 'child_marriage'
  | 'other_gbv';

export type ReportSubtype = SRHRSubtype | GBVSubtype;

// User roles
export type UserRole = 'user' | 'responder' | 'admin';

// Subscription filter used in dashboards
export type SubscriptionFilter = 'All' | 'SRHR' | 'GBV';
// In src/types/api.ts
export type SubscriptionType = 'srhr' | 'gbv' | 'All';

// Main User type from backend
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  organization?: string | null;
  email_verified: boolean;
  subscriptions: ('srhr' | 'gbv')[];
  profile_picture?: string | null;
  created_at: string;

  // Notification & privacy settings
  email_notifications?: boolean;
  sms_notifications?: boolean;
  report_updates?: boolean;
  system_alerts?: boolean;
  language?: string;
  timezone?: string;
  two_factor_auth?: boolean;
  data_sharing?: boolean;
}

// Responder details (for assigned cases)
export interface Responder {
  id: string;
  user: User;
  category: 'srhr' | 'gbv' | 'both';
  phone_number?: string;
  is_active: boolean;
}

// Core Report type — only fields we actually use
export interface Report {
  report_id: string;
  title: string;
  description: string;
  report_type: ReportType;
  subtype: ReportSubtype;
  status: ReportStatus;
  priority: ReportPriority;
  latitude: number;
  longitude: number;
  location: string;
  phone_number?: string;
  images: string[];
  reporter: User;
  assigned_responder?: Responder;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
}

// Stats & Counts
export interface ReportStats {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  critical: number;
}

export interface SRHRStats {
  maternal_health: number;
  contraceptive: number;
  hiv: number;
  family_planning: number;
  other_srhr: number;
}

export interface GBVStats {
  physical_violence: number;
  sexual_violence: number;
  emotional_abuse: number;
  economic_violence: number;
  fgm: number;
  child_marriage: number;
  other_gbv: number;
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Auth tokens
export interface AuthTokens {
  access: string;
  refresh: string;
}



// Add these to the end of src/types/api.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
}


// Add this at the end of src/types/api.ts

export interface CreateFeedbackRequest {
  rating: number;
  message: string;
  page?: string;
}

export interface Feedback extends CreateFeedbackRequest {
  id: string;
  user: User;
  created_at: string;
}


// ──────────────────────────────────────────────
// Responder & Profile Update Types
// ──────────────────────────────────────────────
export interface ResponderDetails {
  id: string;
  category: 'srhr' | 'gbv' | 'both';
  phone_number?: string | null;
  is_active: boolean;
  user: User;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  category?: 'srhr' | 'gbv' | 'both';
  profile_picture?: File | string | null;
}

// ──────────────────────────────────────────────
// Dashboard Stats & Counts
// ──────────────────────────────────────────────
export interface ReportCounts {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  critical: number;
}

export interface DamageCounts {
  minor: number;
  moderate: number;
  severe: number;
  destroyed: number;
}

export interface AssistanceCounts {
  medical: number;
  shelter: number;
  food: number;
  psychological: number;
}

export interface SRHRCounts {
  maternal_health: number;
  contraceptive: number;
  hiv: number;
  family_planning: number;
  other_srhr: number;
}

export interface GBVCounts {
  physical_violence: number;
  sexual_violence: number;
  emotional_abuse: number;
  economic_violence: number;
  fgm: number;
  child_marriage: number;
  other_gbv: number;
}

// ──────────────────────────────────────────────
// Support Tickets — for user support system
// ──────────────────────────────────────────────
export interface CreateSupportTicketRequest {
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'bug' | 'feature' | 'account' | 'other';
}

export interface SupportTicket extends CreateSupportTicketRequest {
  id: string;
  ticket_id: string;
  user: User;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  assigned_to?: User | null;
  replies?: SupportTicketReply[];
}

export interface SupportTicketReply {
  id: string;
  message: string;
  sender: User;
  created_at: string;
  is_staff: boolean;
}