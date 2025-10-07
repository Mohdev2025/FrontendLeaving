// نموذج طلب تسجيل الدخول
export interface LoginModel {
    email: string;
    password: string;
  }
  
  // نموذج استجابة تسجيل الدخول
  export interface LoginResponse {
    token: string;
    user: UserInfo;
  }
  
  // معلومات المستخدم
  export interface UserInfo {
    id: number;
    email: string;
    name?: string;
    role?: string;
    contracttype?: string;
    department?: string;  // إذا موجود في Backend
    position?: string;     // إذا موجود في Backend
    photo?: string;        // إذا موجود في Backend
  }
  
  // لتحديث بيانات تسجيل الدخول
  export interface UpdateLoginDto {
    email: string;
  }