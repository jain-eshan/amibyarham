# Technical Requirements Document (TRD) for AMI by Arham

## 1. System Architecture
AMI by Arham will utilize a modern, serverless architecture to ensure high performance, seamless animations, and scalable backend operations. 
*   **Frontend:** Next.js (React) 
*   **Hosting/Deployment:** Vercel
*   **Backend/Database/Auth:** Supabase
*   **Media Storage:** Supabase Storage

## 2. Frontend Specifications
*   **Framework:** Next.js (App Router recommended for optimal layout and data fetching).
*   **Styling:** Tailwind CSS, adhering strictly to the design tokens (colors, fonts, spacing) outlined in `design.md`.
*   **Animations:** Framer Motion for scroll-triggered storytelling elements and the physics-based swipe engine.
*   **Assets:** The brand logo must be implemented as an optimized SVG. All imagery must be lazy-loaded using the Next.js `<Image/>` component.

## 3. Backend & Supabase Integration
*   **Database:** Supabase Postgres. 
*   **API:** Supabase auto-generated REST/GraphQL APIs via the Supabase JS Client.
*   **Storage:** Supabase Storage buckets configured for user uploads (reference images) and admin-managed inspiration assets (swipe cards).
*   **Security:** Row Level Security (RLS) policies must be implemented. Guest users can insert submissions but cannot read other users' data. Admins require authenticated access to view all submissions.

## 4. Dependencies and Third-Party Services
*   `framer-motion`: For gesture tracking (swiping) and UI transitions.
*   `react-use-gesture`: For mapping touch and drag interactions on the swipe cards.
*   `zod` & `react-hook-form`: For strictly validating URL inputs (Pinterest/IG) and user contact information before Supabase insertion.
*   **Notifications:** Edge functions via Supabase to trigger an email or webhook (e.g., WhatsApp Business API) to the admin upon a new lead submission.

## 5. Constraints and Assumptions
*   Authentication is not required for end-users to submit a request (guest checkout flow).
*   Vercel deployment assumes standard CI/CD pipelines linked to the main Git repository.
*   All uploaded media must be compressed on the client side before uploading to Supabase Storage to minimize bandwidth costs.