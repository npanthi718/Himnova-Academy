const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  code: string;
  details?: any;
  status: number;

  constructor(message: string, code: string = 'API_ERROR', status: number = 500, details?: any) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('himnova_jwt_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorCode = json.error?.code || 'HTTP_ERROR';
      const errorMessage = json.error?.message || json.message || `Request failed with status ${res.status}`;
      throw new ApiError(errorMessage, errorCode, res.status, json.error?.details);
    }

    return json.data !== undefined ? json.data : json;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Network communication error', 'NETWORK_ERROR', 0);
  }
}

// REST wrapper matching both apiClient and api syntax
export const apiClient = {
  get: async <T = any>(url: string): Promise<{ success: boolean; data: T }> => {
    try {
      const data = await request<T>(url, { method: 'GET' });
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null as any };
    }
  },
  post: async <T = any>(url: string, body?: any): Promise<{ success: boolean; data: T }> => {
    try {
      const data = await request<T>(url, { method: 'POST', body: JSON.stringify(body) });
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null as any };
    }
  },
  put: async <T = any>(url: string, body?: any): Promise<{ success: boolean; data: T }> => {
    try {
      const data = await request<T>(url, { method: 'PUT', body: JSON.stringify(body) });
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null as any };
    }
  },
  patch: async <T = any>(url: string, body?: any): Promise<{ success: boolean; data: T }> => {
    try {
      const data = await request<T>(url, { method: 'PATCH', body: JSON.stringify(body) });
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null as any };
    }
  },
  delete: async <T = any>(url: string): Promise<{ success: boolean; data: T }> => {
    try {
      const data = await request<T>(url, { method: 'DELETE' });
      return { success: true, data };
    } catch (err: any) {
      return { success: false, data: null as any };
    }
  },
};

export const api = {
  // Auth
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<any>('/auth/me'),
  forgotPassword: (email: string) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data: { token: string; password: string }) => request<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  // Categories
  getCategories: () => request<any[]>('/categories'),
  createCategory: (data: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => request<any>(`/categories/${id}`, { method: 'DELETE' }),

  // Accounts & Finances
  getFinancialOverview: () => request<any>('/accounts/overview'),
  getExpenses: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/accounts/expenses${query ? `?${query}` : ''}`);
  },
  createExpense: (data: any) => request<any>('/accounts/expenses', { method: 'POST', body: JSON.stringify(data) }),
  deleteExpense: (id: string) => request<any>(`/accounts/expenses/${id}`, { method: 'DELETE' }),
  deleteTrainerPayout: (id: string) => request<any>(`/accounts/payouts/${id}`, { method: 'DELETE' }),
  getTrainerPayouts: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/accounts/payouts${query ? `?${query}` : ''}`);
  },
  createTrainerPayout: (data: any) => request<any>('/accounts/payouts', { method: 'POST', body: JSON.stringify(data) }),
  updatePayoutStatus: (id: string, data: any) => request<any>(`/accounts/payouts/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  getMyTrainerEarnings: () => request<any>('/accounts/trainer/my-earnings'),

  // Payments & Offline QR
  submitManualQrClaim: (data: {
    courseId: string;
    amount: number;
    transactionCode: string;
    senderName: string;
    senderPhone?: string;
    bankWalletName: string;
    receiptScreenshotUrl?: string;
    couponCode?: string;
  }) => request<any>('/payments/manual-claim', { method: 'POST', body: JSON.stringify(data) }),
  verifyManualClaim: (orderId: string, data: { status?: 'COMPLETED' | 'FAILED'; isApproved?: boolean; adminNotes?: string }) =>
    request<any>(`/payments/${orderId}/verify-claim`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePayment: (id: string) => request<any>(`/payments/${id}`, { method: 'DELETE' }),

  // Courses
  getCourses: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/courses${query ? `?${query}` : ''}`);
  },
  getCourseBySlug: (slug: string, userId?: string) =>
    request<any>(`/courses/${slug}${userId ? `?userId=${userId}` : ''}`),
  createCourse: (data: any) => request<any>('/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: string, data: any) => request<any>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: string) => request<any>(`/courses/${id}`, { method: 'DELETE' }),

  // Modules, Lessons & Course Materials
  createModule: (courseId: string, data: any) => request<any>(`/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(data) }),
  updateModule: (moduleId: string, data: any) => request<any>(`/courses/modules/${moduleId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteModule: (moduleId: string) => request<any>(`/courses/modules/${moduleId}`, { method: 'DELETE' }),
  getLesson: (id: string) => request<any>(`/lessons/${id}`),
  createLesson: (data: any) => request<any>('/lessons', { method: 'POST', body: JSON.stringify(data) }),
  updateLesson: (id: string, data: any) => request<any>(`/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLesson: (id: string) => request<any>(`/lessons/${id}`, { method: 'DELETE' }),
  addLessonResource: (lessonId: string, data: any) => request<any>(`/lessons/${lessonId}/resources`, { method: 'POST', body: JSON.stringify(data) }),
  deleteLessonResource: (resourceId: string) => request<any>(`/lessons/resources/${resourceId}`, { method: 'DELETE' }),
  updateLessonProgress: (id: string, data: { isCompleted?: boolean; lastPositionSeconds?: number }) =>
    request<any>(`/lessons/${id}/progress`, { method: 'POST', body: JSON.stringify(data) }),

  // Batches
  getBatches: () => request<any[]>('/batches'),
  getBatch: (id: string) => request<any>(`/batches/${id}`),
  createBatch: (data: any) => request<any>('/batches', { method: 'POST', body: JSON.stringify(data) }),
  updateBatch: (id: string, data: any) => request<any>(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBatch: (id: string) => request<any>(`/batches/${id}`, { method: 'DELETE' }),

  // Enrollments
  getMyEnrollments: () => request<any[]>('/enrollments/my'),
  getAllEnrollments: (params?: Record<string, any>) => {
    const clean: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') clean[k] = String(v);
      });
    }
    const query = new URLSearchParams(clean).toString();
    return request<any[]>(`/enrollments${query ? `?${query}` : ''}`);
  },
  adminEnroll: (data: { userId: string; courseId: string; batchId?: string }) =>
    request<any>('/enrollments/admin-enroll', { method: 'POST', body: JSON.stringify(data) }),

  // Assignments & Submissions
  getAssignments: () => request<any[]>('/assignments'),
  createAssignment: (data: any) => request<any>('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  submitAssignment: (data: any) => request<any>('/submissions', { method: 'POST', body: JSON.stringify(data) }),
  getTrainerSubmissions: () => request<any[]>('/submissions/trainer-list'),
  gradeSubmission: (id: string, data: { score: number; feedback: string; status: string }) =>
    request<any>(`/submissions/${id}/grade`, { method: 'PUT', body: JSON.stringify(data) }),

  // Attendance
  getMyAttendance: () => request<any>('/attendance/my'),
  getBatchAttendance: (batchId: string) => request<any[]>(`/attendance/batch/${batchId}`),
  markBatchAttendance: (batchId: string, data: { date: string; records: any[] }) =>
    request<any>(`/attendance/batch/${batchId}/mark`, { method: 'POST', body: JSON.stringify(data) }),

  // Live Classes
  getMyLiveClasses: () => request<any[]>('/live-classes/my'),
  scheduleLiveClass: (data: any) => request<any>('/live-classes', { method: 'POST', body: JSON.stringify(data) }),

  // Payments & Coupons
  initiatePayment: (data: { courseId: string; provider: string; couponCode?: string }) =>
    request<any>('/payments/initiate', { method: 'POST', body: JSON.stringify(data) }),
  verifyPayment: (data: { orderId: string; provider: string; payload: any }) =>
    request<any>('/payments/verify', { method: 'POST', body: JSON.stringify(data) }),
  getAdminTransactions: () => request<any[]>('/payments/admin-list'),
  validateCoupon: (code: string, courseId?: string, amount?: number) => {
    const query = new URLSearchParams({
      code,
      ...(courseId ? { courseId } : {}),
      ...(amount ? { amount: amount.toString() } : {}),
    }).toString();
    return request<any>(`/coupons/validate?${query}`);
  },
  getCoupons: () => request<any[]>('/coupons'),
  createCoupon: (data: any) => request<any>('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon: (id: string, data: any) => request<any>(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon: (id: string) => request<any>(`/coupons/${id}`, { method: 'DELETE' }),

  // Referrals
  getMyReferrals: () => request<any>('/referrals/my'),
  getAllReferrals: () => request<any[]>('/referrals/admin-list'),
  updateReferralStatus: (id: string, data: { status: string; rewardAmount?: number }) =>
    request<any>(`/referrals/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReferral: (id: string) => request<any>(`/referrals/${id}`, { method: 'DELETE' }),
  checkScheduleConflict: (studentId: string, batchId: string) =>
    request<any>(`/users/${studentId}/check-conflict?batchId=${batchId}`),

  // Certificates
  verifyCertificate: (certNumber: string) => request<any>(`/certificates/verify/${certNumber}`),
  getMyCertificates: () => request<any[]>('/certificates/my'),
  getAllCertificates: () => request<any[]>('/certificates/admin-list'),
  issueCertificate: (data: any) => request<any>('/certificates/issue', { method: 'POST', body: JSON.stringify(data) }),
  deleteCertificate: (id: string) => request<any>(`/certificates/${id}`, { method: 'DELETE' }),

  // Portfolios
  getPublicPortfolio: (username: string) => request<any>(`/portfolios/public/${username}`),
  getMyProjects: () => request<any[]>('/portfolios/my'),
  createProject: (data: any) => request<any>('/portfolios', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  getAdminSummary: () => request<any>('/analytics/admin-summary'),
  getTrainerSummary: () => request<any>('/analytics/trainer-summary'),
  getStudentSummary: () => request<any>('/analytics/student-summary'),

  // AI Assistant
  askAi: (data: {
    courseId?: string;
    lessonId?: string;
    prompt: string;
    contextType: 'COURSE_TUTOR' | 'NOTES_SUMMARY' | 'QUIZ_GENERATOR' | 'RESUME_REVIEW' | 'INTERVIEW_PREP' | 'CAREER_ROADMAP';
  }) => request<any>('/ai/prompt', { method: 'POST', body: JSON.stringify(data) }),

  // Notifications
  getMyNotifications: () => request<any[]>('/notifications/my'),
  markNotificationRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request<any>('/notifications/read-all', { method: 'PUT' }),

  // Users & Profile
  getUsers: (params?: Record<string, any>) => {
    const clean: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') clean[k] = String(v);
      });
    }
    const query = new URLSearchParams(clean).toString();
    return request<any[]>(`/users${query ? `?${query}` : ''}`);
  },
  getUserHistory: (id: string) => request<any>(`/users/${id}/history`),
  adminUpdateUser: (id: string, data: any) => request<any>(`/users/${id}/admin-update`, { method: 'PUT', body: JSON.stringify(data) }),
  shiftStudentCourseBatch: (id: string, data: any) => request<any>(`/users/${id}/shift-course`, { method: 'POST', body: JSON.stringify(data) }),
  adminResetPassword: (id: string, newPassword: string) => request<any>(`/users/${id}/reset-password-admin`, { method: 'POST', body: JSON.stringify({ newPassword }) }),
  deleteUser: (id: string) => request<any>(`/users/${id}`, { method: 'DELETE' }),
  createUser: (data: any) => request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateProfile: (data: any) => request<any>('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data: any) => request<any>('/users/change-password', { method: 'PUT', body: JSON.stringify(data) }),
  updateUserStatus: (id: string, isActive: boolean) =>
    request<any>(`/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ isActive }) }),
  getAuditLogs: (params?: Record<string, any>) => {
    const clean: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') clean[k] = String(v);
      });
    }
    const query = new URLSearchParams(clean).toString();
    return request<any[]>(`/audit-logs${query ? `?${query}` : ''}`);
  },
  getHealth: () => request<any>('/health'),
};
