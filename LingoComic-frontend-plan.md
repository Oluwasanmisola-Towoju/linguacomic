# Implementation Plan: LingoComic Frontend (Next.js App Router)

## Objective
Build a modern, production-ready frontend for `LingoComic` using Next.js (App Router), TypeScript, Tailwind CSS, and React hooks only. The app includes a marketing landing page and a comic translation workspace that simulates backend behavior with mock API functions.

## Scope
- Frontend-only implementation (no backend implementation in this phase).
- Two routes:
  - `/` for marketing and onboarding
  - `/comic` for the translation workspace
- Simulated processing via `lib/mockApi.ts`.
- Frontend prepared for later integration with Python backend APIs.

## Out of Scope
- Real OCR, ML bubble detection, or translation engine.
- Persistent storage, authentication, or user accounts.
- Any Python/backend code implementation in this repository phase.

## Tech Stack
- **Framework:** Next.js (latest, App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + global styles in `styles/globals.css`
- **State management:** React hooks (`useState`, optional `useReducer`)
- **Upload:** `react-dropzone` (preferred) or custom drag-drop
- **Preview:** `URL.createObjectURL`
- **Animation:** Framer Motion (optional, for transitions and overlays)

## Required Packages
- `react-dropzone` for drag-and-drop upload interactions.
- `framer-motion` for optional motion/transitions.
- Optional toast library (for example `sonner` or `react-hot-toast`) for upload/process feedback.

## Tailwind Setup Checklist
- Configure Tailwind in project (Tailwind + PostCSS config files).
- Ensure content globs include `app/**/*`, `components/**/*`, and `lib/**/*` where relevant.
- Import `styles/globals.css` in `app/layout.tsx`.
- Confirm utility classes compile in both landing and workspace routes.

## TypeScript Standards
- Use `.tsx` for React components and `.ts` for utility/service/type files.
- Enable strict TypeScript checks in `tsconfig.json`.
- Avoid `any`; use explicit interfaces/types for props, API payloads, and state.
- Type all async service responses and error shapes from `lib/types.ts`.
- Use typed unions for finite states (for example upload/process status and supported languages).

## Required File/Folder Structure

```text
app/
  layout.tsx
  page.tsx
  comic/
    page.tsx

components/
  marketing/
    Navbar.tsx
    Hero.tsx
    Features.tsx
  ui/
    button.tsx
    card.tsx
  upload/
    UploadDropzone.tsx
  workspace/
    ImagePreview.tsx
    BoundingBoxOverlay.tsx
    LanguageSelector.tsx
    DownloadButton.tsx
    Loader.tsx
lib/
  apiClient.ts
  mockApi.ts
  types.ts

styles/
  globals.css
```

## Product and UX Requirements

### Landing Page (`/`)
- Hero with:
  - Title: `LingoComic`
  - Tagline: `Translate comics into any language without losing the vibe`
  - CTAs:
    - `Try it now` -> `/comic`
    - `See demo` -> smooth scroll to `How it works` section
- Features section:
  - AI Bubble Detection
  - Smart Translation (Pidgin, Yoruba, Swahili, etc.)
  - Auto Text Re-rendering
  - Download-ready output
- How-it-works section (3 steps):
  1. Upload comic
  2. Choose language
  3. Download result
- Footer

### Workspace Page (`/comic`)
- Two-panel layout:
  - Left: Controls
  - Right: Preview/output
- Core states:
  - Empty -> "Upload a comic to start"
  - Uploaded -> show original image
  - Processing -> loader overlay
  - Completed -> show processed image + download button

## State Model (`/comic`)
- `file: File | null`
- `previewUrl: string | null`
- `selectedLanguage: string`
- `isLoading: boolean`
- `processedImage: string | null`
- `boundingBoxes: Array<{ x: number; y: number; width: number; height: number }>`
- `status: 'idle' | 'uploading' | 'processing' | 'success' | 'error'` (recommended typed union)

## Mock API Contract (`lib/mockApi.ts`)
- `uploadComic(file: File): Promise<{ boundingBoxes: Box[]; imageUrl: string }>`
- `processComic(language: string, imageUrl: string): Promise<{ processedImageUrl: string; translatedLabels: string[] }>`

Simulation behavior:
- Delay with `setTimeout`/Promise wrappers.
- Return fixed mock bounding boxes for detected speech bubbles.
- Return same image URL as processed output for v1.
- Return mock translated labels by language.

## Python Backend Integration Readiness

The frontend should be implemented so mock calls can be swapped with real Python APIs without refactoring UI components.

### Integration strategy
- Add a lightweight API client layer (for example `lib/apiClient.ts`) that exposes the same function signatures as `mockApi`.
- Keep UI pages/components dependent on an abstract service interface, not direct `fetch` calls.
- Toggle mock vs real mode using environment config:
  - `NEXT_PUBLIC_API_MODE=mock|live`
  - `NEXT_PUBLIC_API_BASE_URL=https://your-python-api-domain`
- Runtime config source:
  - use `.env.local` for local development variables
  - fallback to `mock` mode if required live env vars are missing

### Expected API shape from Python backend (target contract)
- `POST /api/comics/upload` (multipart form-data)
  - Request: comic file (`png`, `jpg`, `jpeg`)
  - Response: `{ uploadId, imageUrl, boundingBoxes }`
- `POST /api/comics/process`
  - Request: `{ uploadId, language }`
  - Response: `{ processedImageUrl, translatedLabels, boundingBoxes? }`
- `GET /api/comics/:id/download`
  - Response: image file/blob for download

### API error contract expectations
- Standard error shape from backend:
  - `{ error: { code: string; message: string; details?: unknown } }`
- Expected status handling:
  - `400/422`: invalid request data -> show actionable validation message
  - `413`: file too large -> show size guidance
  - `500`: processing/server failure -> show retry option
  - network timeout/offline -> show reconnect/retry guidance

### Frontend data contracts
- Define shared TypeScript types in `lib/types.ts` for:
  - `BoundingBox`
  - `UploadComicResponse`
  - `ProcessComicResponse`
  - `SupportedLanguage`
- Keep current mock functions aligned with these contracts to avoid migration issues.

### Error and loading model for real APIs
- Handle API states explicitly:
  - idle, uploading, processing, success, error
- Surface user-facing errors for:
  - unsupported file type
  - payload too large
  - network timeout
  - processing failure
- Provide retry actions for upload/process failures.
- Keep button disabled states synchronized with upload/processing state to prevent duplicate requests.

### Security and network considerations (frontend)
- Do not store secrets in frontend code.
- Use only `NEXT_PUBLIC_*` vars client-side.
- Prefer short request timeouts and graceful abort via `AbortController`.
- Validate MIME types client-side before upload.
- Abort in-flight upload/process requests when component unmounts or user replaces file.

## Visual Design System
- Dark theme background (black/charcoal).
- Purple/indigo gradient accents and subtle glow effects.
- Rounded corners (`rounded-xl` or larger).
- Glassmorphism panels (`backdrop-blur`, translucent backgrounds, soft borders).
- Spacious layout and large, readable typography.
- Smooth hover/focus transitions on interactive elements.

## Figma UI Reference
- Primary UI reference for upload/dropzone patterns:
  - [File Uploader - Drop Zone (Figma)](https://www.figma.com/design/SxegLdtuGqE39xo9oHvtxz/File-Uploader---Drop-Zone--Community-?node-id=0-1&p=f&t=3mekk63TXRY1CbbU-0)
- Use this reference to guide:
  - dropzone visual hierarchy (icon, helper text, accepted file types)
  - drag-over state emphasis (border/overlay/background shift)
  - upload success state presentation (file name, file size, replace option)
  - spacing, corner radius, and subtle elevation

### Figma-driven styling requirements (to apply in LingoComic theme)
- Preserve LingoComic dark + purple identity while borrowing layout structure from reference.
- Upload card should include:
  - prominent dashed or accented border
  - clear primary message: "Drag and drop comic page"
  - secondary support text: "PNG or JPG"
  - optional "Browse files" action
- State visuals:
  - idle: muted border + soft glass background
  - drag-over: brighter border + glow + slightly elevated panel
  - uploaded: confirmation row with file metadata and thumbnail hint
  - error: concise inline message with corrective action
- Ensure touch targets and text contrast remain accessible.

## Accessibility and Interaction Requirements
- Keyboard-accessible controls and dropzone.
- Proper labels for language selector and buttons.
- Visible focus states.
- Drag-over highlight state.
- Reasonable alt text for preview images.

## Implementation Phases

### Phase 1: Foundation and Setup
- [ ] Initialize Next.js App Router project with Tailwind.
- [ ] Configure `styles/globals.css` with dark theme tokens and base styles.
- [ ] Create app shell in `app/layout.tsx`.
- [ ] Create reusable UI primitives:
  - [ ] `components/ui/button.tsx`
  - [ ] `components/ui/card.tsx`
- [ ] Create `components/marketing/Navbar.tsx` and place it on landing page.
- [ ] Set up TypeScript strict mode and validate project compiles with no type errors.
- [ ] Create typed frontend API contracts (`lib/types.ts`).
- [ ] Create `lib/apiClient.ts` interface with mock/live implementations.

**Acceptance criteria**
- [ ] App runs with Tailwind styles applied.
- [ ] Global dark theme appears correctly.
- [ ] Base UI components are reusable and styled consistently.
- [ ] Navbar is present and consistent with landing style.
- [ ] API-related TypeScript contracts exist and are used by mock layer.
- [ ] `tsc --noEmit` passes without type errors.

### Phase 2: Marketing Page
- [ ] Build `components/marketing/Navbar.tsx`.
- [ ] Build `components/marketing/Hero.tsx`.
- [ ] Build `components/marketing/Features.tsx`.
- [ ] Compose landing page in `app/page.tsx` with hero, features, how-it-works, and footer.

**Acceptance criteria**
- [ ] Hero contains required title, tagline, and CTAs.
- [ ] Feature cards include all required capabilities.
- [ ] `Try it now` routes to `/comic`.
- [ ] `See demo` smoothly scrolls to `How it works`.
- [ ] Layout is responsive and visually aligned with design goals.

### Phase 3: Workspace Structure
- [ ] Scaffold `app/comic/page.tsx` two-panel layout.
- [ ] Add local state for file, preview URL, language, loading, processed image, and bounding boxes.
- [ ] Wire initial placeholders for controls and preview panels.

**Acceptance criteria**
- [ ] Workspace route renders without errors.
- [ ] State transitions can be triggered via UI interactions.
- [ ] Empty state message is visible before upload.

### Phase 4: Upload and Preview
- [ ] Implement `components/upload/UploadDropzone.tsx`.
- [ ] Restrict file types to PNG/JPG.
- [ ] Show filename and file size after upload.
- [ ] Create preview URL using `URL.createObjectURL`.
- [ ] Render preview in `components/workspace/ImagePreview.tsx`.
- [ ] Match dropzone interaction states to Figma reference style, adapted to LingoComic dark theme.

**Acceptance criteria**
- [ ] Drag/drop and click-to-upload both work.
- [ ] Uploaded image previews immediately.
- [ ] Invalid file types are rejected with user feedback (toast or inline message).
- [ ] Drag-over highlight effect is visible.
- [ ] Upload area follows Figma-inspired structure and state transitions.

### Phase 5: Language and Processing Flow
- [ ] Implement `components/workspace/LanguageSelector.tsx` with:
  - Nigerian Pidgin
  - Yoruba
  - Swahili
  - French
  - Spanish
- [ ] Implement `lib/mockApi.ts` for upload and process simulation.
- [ ] Add API service abstraction that can switch between mock and live Python backend.
- [ ] Implement `Translate Comic` action in `app/comic/page.tsx`.
- [ ] Add `components/workspace/Loader.tsx` overlay during processing.
- [ ] Ensure all service calls and state transitions are strongly typed (no implicit `any`).

**Acceptance criteria**
- [ ] Selecting a language updates local state.
- [ ] Clicking `Translate Comic` triggers simulated async flow.
- [ ] Loading spinner/overlay appears while processing.
- [ ] After processing, completed state is shown.
- [ ] Switching from mock mode to live mode requires no UI component rewrites.

### Phase 6: Bounding Boxes and Download
- [ ] Implement `components/workspace/BoundingBoxOverlay.tsx` to render mock rectangles.
- [ ] Display boxes in uploaded/processed states as needed.
- [ ] Implement `components/workspace/DownloadButton.tsx`.
- [ ] Enable download after processing completes.
- [ ] Implement frontend download mechanism:
  - fetch processed asset as blob (or use processed URL when allowed)
  - create temporary object URL
  - trigger anchor download with meaningful filename (for example `lingocomic-<language>-processed.png`)
  - revoke temporary object URL after download

**Acceptance criteria**
- [ ] Mock speech bubble boxes appear correctly over image.
- [ ] Download button is hidden until completed state.
- [ ] Clicking download saves processed image locally.
- [ ] Downloaded filename is deterministic and user-friendly.

### Phase 7: Polish and Quality
- [ ] Add subtle transitions and hover effects (Tailwind + optional Framer Motion).
- [ ] Add lightweight toasts for success/error (optional nice-to-have).
- [ ] Verify keyboard navigation and focus visibility.
- [ ] Refine spacing/typography for production-readiness.

**Acceptance criteria**
- [ ] UI feels smooth and cohesive.
- [ ] No obvious accessibility blockers in primary interactions.
- [ ] Build succeeds with clean frontend code organization.

## Suggested Component Responsibilities
- `UploadDropzone.tsx`: Input and drag-drop handling, validation, file metadata display.
- `LanguageSelector.tsx`: Stateless selector UI with callback.
- `ImagePreview.tsx`: Handles empty/uploaded/processing/completed visuals.
- `BoundingBoxOverlay.tsx`: Pure rendering of normalized/absolute box coordinates.
- `Loader.tsx`: Processing overlay/spinner.
- `DownloadButton.tsx`: Trigger image download logic.
- `Navbar.tsx`, `Hero.tsx`, `Features.tsx`: Marketing content blocks.

## Verification Checklist
- [ ] Route `/` renders all required sections.
- [ ] Navbar renders and remains usable across breakpoints.
- [ ] Route `/comic` supports full flow:
  - [ ] Upload -> Preview
  - [ ] Select Language
  - [ ] Translate Comic (mock async)
  - [ ] Loader overlay visible while processing
  - [ ] Processed state + download button
- [ ] PNG/JPG validation works.
- [ ] Drag-over and hover states behave correctly.
- [ ] Keyboard navigation works on main controls.
- [ ] Mock mode works end-to-end without backend availability.
- [ ] Live mode can be enabled via env vars for Python API integration.
- [ ] Live mode gracefully falls back or errors clearly when env vars are missing.
- [ ] Upload/dropzone UI is visually consistent with Figma reference patterns and adapted brand styling.

## Risks and Mitigations
- **Risk:** Overlay coordinates misalign with responsive image.
  - **Mitigation:** Use a relative container and scale boxes against rendered dimensions.
- **Risk:** Object URLs leak memory.
  - **Mitigation:** Revoke URL on cleanup and when replacing files.
- **Risk:** Async mock flow creates stale state updates.
  - **Mitigation:** Guard updates using current file/session refs.

## Implementation Notes
- Keep components functional and modular.
- Avoid over-engineering; keep state colocated in `/comic` unless reuse justifies extraction.
- Prefer clean prop interfaces and explicit types.
- Keep styling consistent with dark futuristic direction.
- Revoke preview object URLs on cleanup to prevent memory leaks.
- Cancel or ignore stale async responses when newer requests are initiated.
