export default () => ({
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '30d',
  },
  mail: {
    from: process.env.MAIL_FROM ?? 'CCTV Shop <no-reply@example.com>',
    staffAlert: process.env.STAFF_ALERT_EMAIL ?? 'sales@example.com',
  },
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? '15551234567',
});
