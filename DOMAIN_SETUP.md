# Custom Domain Setup

Your app is live at:

https://career-compass-ai-ochre-rho.vercel.app

To use a professional domain like `careercompass.ai`:

## 1. Buy a domain
Use Namecheap, Cloudflare Registrar, Google/Squarespace Domains, or GoDaddy.

## 2. Add domain in Vercel
1. Open your Vercel project
2. Settings → Domains
3. Enter the domain → Add

## 3. Configure DNS
Use the exact records Vercel shows. Typical setup:

- A record for `@` → `76.76.21.21`
- CNAME for `www` → `cname.vercel-dns.com`

## 4. Wait for SSL
Vercel provisions HTTPS automatically once DNS validates.

## 5. Update Supabase auth URLs
Authentication → URL Configuration:

- Site URL = `https://yourdomain.com`
- Redirect URLs include `https://yourdomain.com` and localhost for development
