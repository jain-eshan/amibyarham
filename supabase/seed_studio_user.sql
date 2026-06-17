-- Seed an initial studio admin user.
-- The password hash below corresponds to "admin123" — change in production.
-- Generate a new hash: node -e "require('bcryptjs').hash('YOUR_PASSWORD',10).then(h=>console.log(h))"
INSERT INTO public.studio_users (email, password_hash, name)
VALUES (
  'studio@amibyarham.com',
  '$2a$10$rG8Jx7Ry8JZPZ8vYfZNZXOJZqR7JkQEJZxJ6Z9VbZ1Qv5Z3ZkZZe',
  'Studio Admin'
)
ON CONFLICT (email) DO NOTHING;
