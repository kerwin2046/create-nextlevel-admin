const required = ['JWT_SECRET', 'DATABASE_URL'] as const;

export function validateEnv(): void {
  if (process.env.NODE_ENV === 'development' && !process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'dev-secret-change-in-production';
  }
  if (
    process.env.NODE_ENV === 'development' &&
    !process.env.DATABASE_URL
  ) {
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/admin?schema=public';
  }
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required env: ${missing.join(', ')}`);
    process.exit(1);
  }
}
