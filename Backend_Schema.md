# Backend Data Schema for AMI by Arham

The database will be hosted on Supabase (PostgreSQL). The schema separates the inspiration inventory from user submissions to ensure normalized data relationships.

### Table: `inspiration_images`
Stores the curated images used in the Swipe Engine.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the image. |
| `image_url` | Text | Not Null | Supabase Storage URL for the asset. |
| `alt_text` | Text | Nullable | Description for accessibility. |
| `category` | Text | Nullable | Free-text label, e.g., 'necklace', 'ring', 'bridal'. |
| `jewelry_type` | Text | Nullable | Single discovery facet: `Ring`, `Necklace`, `Earrings`, `Bracelet`, `Maang Tikka`, `Set`. |
| `occasions` | Text[] | Default: `'{}'` | Multi-value facet: `Wedding`, `Engagement`, `Everyday`, `Statement`. GIN-indexed. |
| `metals` | Text[] | Default: `'{}'` | Multi-value facet: `18k Gold`, `22k Gold`, `Rose Gold`, `White Gold`. GIN-indexed. |
| `styles` | Text[] | Default: `'{}'` | Multi-value facet: `Polki`, `Jadau`, `Modern`, `Minimalist`. GIN-indexed. |
| `created_at` | Timestamp | Default: `now()` | Record creation time. |

> The four facet columns power the **Filter-First Swipe Flow**. The catalogue is loaded once and filtered client-side so the "N pieces match" count updates instantly; the GIN indexes prepare for moving array-overlap filtering server-side as the catalogue grows.

### Table: `leads`
Stores the contact information for users who have submitted a request.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the lead. |
| `full_name` | Text | Not Null | User's provided name. |
| `whatsapp_number` | Text | Not Null | User's contact number. |
| `email` | Text | Nullable | Optional email address. |
| `created_at` | Timestamp | Default: `now()` | Record creation time. |

### Table: `custom_requests`
Stores the specific details of a user's bespoke inquiry (Path A or Path B).

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the request. |
| `lead_id` | UUID | Foreign Key (`leads.id`), Not Null | Links the request to the user. |
| `request_type` | Text | Not Null | ENUM: `external_link`, `direct_upload`, `swipe_board`. |
| `external_url` | Text | Nullable | The IG/Pinterest link provided by the user. |
| `uploaded_media_url`| Text | Nullable | Supabase Storage URL if the user uploaded a file. |
| `design_notes` | Text | Nullable | User's custom modifications or text instructions. |
| `applied_filters` | JSONB | Nullable | Filter combination that produced a swipe board, e.g. `{ "jewelryType": ["Ring"], "occasion": ["Wedding"] }`. Lead context + analytics. |
| `status` | Text | Default: `'pending'` | ENUM: `pending`, `contacted`, `converted`, `closed`. |
| `created_at` | Timestamp | Default: `now()` | Record creation time. |

### Table: `request_favorite_items`
A junction table mapping a specific `custom_request` (where `request_type` = 'swipe_board') to the `inspiration_images` the user swiped right on.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `request_id` | UUID | Foreign Key (`custom_requests.id`), Not Null | The specific submission. |
| `image_id` | UUID | Foreign Key (`inspiration_images.id`), Not Null | The swiped image. |