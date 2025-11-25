// Updated: src/types/api.ts
// Changes:
// 1. Adjusted role to lowercase 'citizen' | 'responder' | 'admin' to match backend values.
// 2. Removed fields not present in backend CustomUser: phone, organization, location, bio, avatar (can add to models if needed).
// 3. Kept first_name, last_name as optional (from AbstractUser).
// 4. For ResponderDetails, adjusted to match backend: added category instead of specialization (array), removed response_rating, total_responses (not in backend).
// 5. No changes to other types like Report, etc., as they seem aligned.
// 6. In SignupRequest, updated role choices to lowercase.
// 7. In UpdateProfileRequest, removed fields not in backend serializer: phone, organization, location, bio, subscriptions (wait, subscriptions is there), added first_name, last_name.

// API Types for mReport Dashboard
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'citizen' | 'responder' | 'admin';
  subscriptions: string[];
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ResponderDetails {
  id: number;
  user: number;
  category: string;  // 'damage' | 'assistance' | 'srhr'
  phone_number?: string;
  is_active: boolean;
  // Removed: specialization, status, response_rating, total_responses (not in backend)
}

export interface Report {
  id: number;
  title: string;
  description: string;
  type: 'Infrastructure' | 'Emergency' | 'Health' | 'Education' | 'SRHR';
  subtype: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  address: string;
  images: string[];
  reporter: User;
  assigned_responder?: ResponderDetails;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface ReportCounts {
  Infrastructure: number;
  Emergency: number;
  Health: number;
  Education: number;
  SRHR: number;
}

export interface DamageCounts {
  [key: string]: number;
}

export interface AssistanceCounts {
  [key: string]: number;
}

export interface SRHRCounts {
  [key: string]: number;
}

export interface Feedback {
  id: number;
  report: number;
  user: number;
  satisfaction_score: 1 | 2 | 3 | 4 | 5;
  comments: string;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  user: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  admin_response?: string;
  admin_response_date?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role: 'citizen' | 'responder' | 'admin';
  subscriptions: string[];
  first_name?: string;
  last_name?: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  subscriptions?: string[];
}

export interface CreateReportRequest {
  title: string;
  description: string;
  type: 'Infrastructure' | 'Emergency' | 'Health' | 'Education' | 'SRHR';
  subtype: string;
  latitude: number;
  longitude: number;
  address: string;
  images?: File[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CreateFeedbackRequest {
  report: number;
  satisfaction_score: 1 | 2 | 3 | 4 | 5;
  comments: string;
}

export interface CreateSupportTicketRequest {
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
