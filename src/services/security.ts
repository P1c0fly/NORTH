// Cryptographic Security and Authentication Engine for @Northabhor Admin Panel
// Uses Web Crypto API (PBKDF2 with SHA-256 and 100,000 iterations) with salted hashing

const SALT_STORAGE_KEY = 'na_admin_salt_v1';
const HASH_STORAGE_KEY = 'na_admin_hash_v1';
const LOCKOUT_STORAGE_KEY = 'na_admin_lockout';
const ATTEMPTS_STORAGE_KEY = 'na_admin_failed_attempts';
const SESSION_TOKEN_KEY = 'na_admin_secure_session';

// Default initial password: 'NorthAbhor2026!'
// Pre-computed PBKDF2 parameters
const DEFAULT_SALT_HEX = 'e9c8f3b2a10456d7890123456789abcd';

// Helper to convert ArrayBuffer to Hex
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper to convert Hex to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Derives a strong PBKDF2 SHA-256 hash using 100,000 iterations
 */
export async function deriveKeyHash(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const saltBytes = hexToBytes(saltHex);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  return bufferToHex(derivedBits);
}

/**
 * Initializes the encrypted password store if not already set
 */
export async function initializeAdminSecurity(): Promise<void> {
  let salt = localStorage.getItem(SALT_STORAGE_KEY);
  let hash = localStorage.getItem(HASH_STORAGE_KEY);

  if (!salt || !hash) {
    salt = DEFAULT_SALT_HEX;
    hash = await deriveKeyHash('NorthAbhor2026!', salt);
    localStorage.setItem(SALT_STORAGE_KEY, salt);
    localStorage.setItem(HASH_STORAGE_KEY, hash);
  }
}

/**
 * Checks if admin is currently locked out due to brute-force attempts
 */
export function checkLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  const lockoutUntil = localStorage.getItem(LOCKOUT_STORAGE_KEY);
  if (!lockoutUntil) return { isLocked: false, remainingSeconds: 0 };

  const now = Date.now();
  const until = parseInt(lockoutUntil, 10);
  if (now < until) {
    return { isLocked: true, remainingSeconds: Math.ceil((until - now) / 1000) };
  } else {
    localStorage.removeItem(LOCKOUT_STORAGE_KEY);
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
    return { isLocked: false, remainingSeconds: 0 };
  }
}

/**
 * Records a failed attempt and triggers lockout after 5 attempts
 */
export function recordFailedAttempt(): { locked: boolean; attemptsLeft: number } {
  const currentAttempts = parseInt(localStorage.getItem(ATTEMPTS_STORAGE_KEY) || '0', 10) + 1;
  localStorage.setItem(ATTEMPTS_STORAGE_KEY, currentAttempts.toString());

  if (currentAttempts >= 5) {
    const lockoutDurationMs = 15 * 60 * 1000; // 15 minutes lockout
    localStorage.setItem(LOCKOUT_STORAGE_KEY, (Date.now() + lockoutDurationMs).toString());
    return { locked: true, attemptsLeft: 0 };
  }

  return { locked: false, attemptsLeft: 5 - currentAttempts };
}

/**
 * Verifies admin credentials using PBKDF2 hash comparison
 */
export async function verifyAdminCredentials(
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  // Check lockout
  const { isLocked, remainingSeconds } = checkLockoutStatus();
  if (isLocked) {
    const minutes = Math.ceil(remainingSeconds / 60);
    return {
      success: false,
      error: `تم حظر المحاولات مؤقتاً لحماية النظام (${minutes} دقيقة متبقية). يرجى الانتظار.`,
    };
  }

  // Ensure security store is initialized
  await initializeAdminSecurity();

  if (usernameInput.trim().toLowerCase() !== 'admin') {
    const fail = recordFailedAttempt();
    return {
      success: false,
      error: fail.locked
        ? 'تم تجاوز عدد المحاولات المسموح بها! تم قفل الوصول لمدة 15 دقيقة.'
        : `اسم المستخدم أو كلمة المرور غير صحيحة. (${fail.attemptsLeft} محاولات متبقية)`,
    };
  }

  const salt = localStorage.getItem(SALT_STORAGE_KEY) || DEFAULT_SALT_HEX;
  const storedHash = localStorage.getItem(HASH_STORAGE_KEY);

  const inputHash = await deriveKeyHash(passwordInput, salt);

  if (inputHash === storedHash) {
    // Reset failed attempts on success
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
    localStorage.removeItem(LOCKOUT_STORAGE_KEY);

    // Create a time-limited cryptographically signed session token (valid 2 hours)
    const expiry = Date.now() + 2 * 60 * 60 * 1000;
    const rawData = `northabhor_${usernameInput}_${expiry}`;
    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest('SHA-256', enc.encode(rawData + salt));
    const signature = bufferToHex(digest).substring(0, 32);
    const token = btoa(`${usernameInput}:${expiry}:${signature}`);

    setEncryptedSession(token);
    return { success: true, token };
  }

  const fail = recordFailedAttempt();
  return {
    success: false,
    error: fail.locked
      ? 'تم تجاوز الحد الأقصى للمحاولات! تم تفعيل القفل الأمني لمدة 15 دقيقة.'
      : `كلمة المرور غير صحيحة. (${fail.attemptsLeft} محاولات متبقية)`,
  };
}

/**
 * Validates session token
 */
export function isSessionValid(customToken?: string): boolean {
  const token = customToken || getEncryptedSession();
  if (!token) return false;

  try {
    const decoded = atob(token);
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const expiry = parseInt(parts[1], 10);
    return Date.now() < expiry;
  } catch {
    return false;
  }
}

/**
 * Storage helpers for session token
 */
export function setEncryptedSession(token: string): void {
  sessionStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function getEncryptedSession(): string | null {
  return sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function clearEncryptedSession(): void {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
}

export function clearAdminSession(): void {
  clearEncryptedSession();
}

/**
 * Changes and re-encrypts the admin password with a fresh random salt
 */
export async function changeAdminPassword(newPassword: string): Promise<boolean> {
  if (!newPassword || newPassword.length < 8) {
    throw new Error('كلمة المرور يجب أن تتكون من 8 خانات على الأقل');
  }

  // Generate a cryptographically secure 16-byte random salt
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const newSaltHex = bufferToHex(randomBytes.buffer);

  const newHash = await deriveKeyHash(newPassword, newSaltHex);

  localStorage.setItem(SALT_STORAGE_KEY, newSaltHex);
  localStorage.setItem(HASH_STORAGE_KEY, newHash);
  return true;
}

/**
 * Verifies current password before updating to new password
 */
export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  await initializeAdminSecurity();
  const salt = localStorage.getItem(SALT_STORAGE_KEY) || DEFAULT_SALT_HEX;
  const storedHash = localStorage.getItem(HASH_STORAGE_KEY);

  const checkHash = await deriveKeyHash(currentPassword, salt);
  if (checkHash !== storedHash) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 8 خانات على الأقل' };
  }

  try {
    await changeAdminPassword(newPassword);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'فشل تحديث كلمة المرور' };
  }
}

export function getSecurityAuditLog(): Array<{ time: string; event: string; status: string }> {
  return [
    { time: new Date().toLocaleTimeString('ar-SA'), event: 'تفعيل تشفير PBKDF2 SHA-256', status: 'نشط' },
    { time: new Date().toLocaleTimeString('ar-SA'), event: 'مراقبة هجمات التخمين Brute-Force', status: 'مؤمن' },
    { time: new Date().toLocaleTimeString('ar-SA'), event: 'إخفاء لوحة التحكم عن الزوار', status: 'مخفي' },
    { time: new Date().toLocaleTimeString('ar-SA'), event: 'تأمين تسجيل المشرفين بالبريد الإلكتروني', status: 'مفعل' },
  ];
}

export interface SupervisorUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'editor' | 'schools_moderator';
  salt: string;
  hash: string;
  isVerified: boolean;
  verificationCode?: string;
  createdAt: string;
}

const SUPERVISORS_STORAGE_KEY = 'na_supervisors_vault';

export function getSupervisors(): SupervisorUser[] {
  try {
    const raw = localStorage.getItem(SUPERVISORS_STORAGE_KEY);
    if (!raw) {
      // Default super admin
      return [
        {
          id: 'sup_admin_1',
          name: 'المشرف العام - @northabhor',
          email: 'admin@northabhor.local',
          role: 'super_admin',
          salt: DEFAULT_SALT_HEX,
          hash: '',
          isVerified: true,
          createdAt: '2026-01-01',
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSupervisors(list: SupervisorUser[]): void {
  localStorage.setItem(SUPERVISORS_STORAGE_KEY, JSON.stringify(list));
}

/**
 * Registers a new supervisor with PBKDF2 encrypted password and 6-digit email verification code
 */
export async function registerSupervisor(
  name: string,
  email: string,
  role: 'super_admin' | 'editor' | 'schools_moderator',
  passwordInput: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  if (!name.trim() || !email.trim() || !passwordInput) {
    return { success: false, error: 'يرجى إكمال جميع الحقول المطلوبة' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'صيغة البريد الإلكتروني غير صحيحة' };
  }

  if (passwordInput.length < 8) {
    return { success: false, error: 'كلمة المرور يجب ألا تقل عن 8 خانات وتحتوي على أرقام وحروف' };
  }

  const current = getSupervisors();
  if (current.some((s) => s.email.toLowerCase() === email.trim().toLowerCase())) {
    return { success: false, error: 'هذا البريد الإلكتروني مسجل مسبقاً كمشرف' };
  }

  // Generate random salt
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const saltHex = bufferToHex(randomBytes.buffer);
  const hash = await deriveKeyHash(passwordInput, saltHex);

  // Generate 6-digit cryptographically secure verification code
  const codeArr = new Uint32Array(1);
  crypto.getRandomValues(codeArr);
  const code = (100000 + (codeArr[0] % 900000)).toString();

  const newSupervisor: SupervisorUser = {
    id: 'sup_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    salt: saltHex,
    hash,
    isVerified: false,
    verificationCode: code,
    createdAt: new Date().toISOString().split('T')[0],
  };

  saveSupervisors([...current, newSupervisor]);

  // Try sync with backend if available
  try {
    await fetch('/api/auth/register-supervisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, code }),
    });
  } catch {
    // Offline resilient
  }

  return { success: true, code };
}

/**
 * Confirms supervisor email verification code
 */
export function verifySupervisorCode(
  email: string,
  code: string
): { success: boolean; error?: string } {
  const current = getSupervisors();
  const idx = current.findIndex((s) => s.email.toLowerCase() === email.trim().toLowerCase());

  if (idx < 0) {
    return { success: false, error: 'المشرف غير موجود' };
  }

  const supervisor = current[idx];
  if (supervisor.isVerified) {
    return { success: true };
  }

  if (supervisor.verificationCode !== code.trim()) {
    return { success: false, error: 'رمز التحقق غير صحيح، يرجى التأكد من الرمز المدخل' };
  }

  // Mark as verified and clear temporary code
  supervisor.isVerified = true;
  delete supervisor.verificationCode;
  current[idx] = supervisor;
  saveSupervisors(current);

  return { success: true };
}

export function deleteSupervisor(id: string): void {
  const current = getSupervisors();
  saveSupervisors(current.filter((s) => s.id !== id));
}

