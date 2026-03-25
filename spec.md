# NexaAI Platform

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Home page: hero section, features grid, testimonials, CTA
- Authentication: login and signup pages with fully functional user auth (sessions managed via backend)
- Dashboard: sidebar navigation, overview stats, quick access to tools
- Blog section: grid of post cards with dummy content
- AI Tools page: text summarizer, AI chat, content generator (UI with placeholder logic)
- Contact page: form with name, email, message fields
- Error pages: 404 and 500
- Reusable components: header (with nav + auth state), footer, cards
- Smooth scrolling, transitions, responsive layout

### Modify
N/A -- new project

### Remove
N/A -- new project

## Implementation Plan
1. Select `authorization` component for user auth (login, signup, session management)
2. Generate Motoko backend with: user registration, login, session tokens, blog post storage (read-only seed data), AI tool stub endpoints (echo/placeholder)
3. Frontend: implement all 7+ pages with React Router, dark SaaS theme, gradient accents, reusable Header/Footer/Card components, responsive layout with Tailwind
4. Wire auth pages to backend (register/login/logout), dashboard shows logged-in user info
5. AI tools page: text summarizer, AI chat, content generator with frontend-only mock responses
6. Blog: static dummy posts rendered as cards
7. Contact form: client-side with success state
