# Mnestix Project Coding Instructions

## Project Structure

- Frontend is built with Next.js 16+, using the App Router
- Translations are in src/locale/[lang].json files
- We are using next-intl for internationalization
- Shared components are in src/components
- Page components are in src/app/[locale]/...

## Code Style

- We use TypeScript for all new code
- We prefer functional components with hooks over class components
- We use absolute imports instead of relative imports
- We prefer normal functions over arrow functions for better readability
- We use Material-UI (MUI) for our UI components
- We use single quotes
- Follow eslint.config.js guidelines

## State Management

- We use React Context for global state where needed
- We prefer local component state when possible
- Avoid using useState when data can be derived from props or context
- Avoid useEffect for transforming data for rendering, only use them for syncing with external systems

## API Integration

- RESTful API communication is handled via fetch
- Backend API integrations should include proper error handling
- All frontend-backend communication is wrapped in `apiResponseWrapper.ts` to ensure correct typing
- Primary call from frontend to backend should be a stateless async function in `Actions.ts` files in `src/lib/services` directory, marked with `use server;`

## Security

Server actions (`use server`) and route handlers are **public, unauthenticated POST endpoints** reachable by anyone on the network. Client-side gating (`<PrivateRoute>`, conditionally rendered UI) protects only what the browser draws — never the endpoint itself. Two classes of flaw have shipped here before; guard against both in every new action.

### Authorize mutating/config/admin actions on the server

- The authorization check is the **first line inside the action**, not middleware. `src/proxy.ts` and edge middleware cannot see `next-action` calls, so they cannot enforce it.
- Use the shared guard in `lib/util/securityHelpers/authGuard.ts`: `requireAdmin()` / `requireRole(...)` in server actions (they throw), and `getAuthError(...)` in REST route handlers (return a `Response` — a thrown error there becomes a 500).
- The guard is flag-aware: `AUTHENTICATION_FEATURE_FLAG=false` → open by design; `true` → **401** when no session, **403** on wrong role. Never bypass the flag with a manual check.
- Guard **writes, config, and admin-only reads** (infrastructure/connection CRUD, id-generation settings, blueprints/templates, `/api/mnestixConnections`). Do **not** role-gate the browsing/read path or internal resolvers (`getInfrastructureByName`, `getInfrastructuresIncludingDefault`, `search*`/`get*` data actions, `getEnv`) — that breaks the default auth-off deployment and normal viewing.

### Never fetch a client-supplied URL with credentials attached

Passing a client-controlled `url` to a server-side `fetch` with infrastructure credentials attached is full-read SSRF (CWE-918) **plus** credential disclosure (CWE-522): the attacker names a real infrastructure to borrow its key but points `url` at their own host or an internal address. In any action that fetches a client-supplied `repository.url`, apply both guards from `lib/util/securityHelpers/repositoryFetchGuard.ts`:

- `assertEgressAllowed(url, infrastructureName)` — rejects non-`http(s)` schemes and targets that resolve to loopback / link-local / cloud-metadata (`169.254.169.254`) / RFC1918 / ULA, **unless** the target is a configured infrastructure host. (The operator's own backend often lives on a private address such as `backend:8081`, so private targets can't be blanket-blocked — only *unconfigured* ones.)
- `securityHeadersForUrl(url, infrastructure)` — returns credentials **only** when the URL's host matches a configured origin of that infrastructure; otherwise the fetch goes out without them. Never call `createSecurityHeaders` directly on a client-supplied URL.

### Validate untrusted input

- Deny-list dangerous request headers (`Authorization`, `Cookie`, …) **case-insensitively** — see `lib/util/securityHelpers/ValidateSecurityInput.ts`. A case-sensitive check is a bypass.
- Encrypted infrastructure secrets must never cross the server/client boundary in an action's return value or props.

## Documentation

- Add JSDoc comments for exported functions and components
- Include detailed PR descriptions with test coverage information
- Documentation can be added in docs/ and wiki/

## Testing

We use three different testing principles in our project.

### Unit tests

- They are testing small parts of our logic, like single functions in the backend.
- They are written with the jest testing framework
- All communication to external services should be mocked using the nullability testing paradigm. That means services which perform logic operations should not be performing network calls themselves, but need to be injected the correct interface abstractions, which can be mocked by implementing a in-memory version. We use `create()` and `createNull()` as constructors to differentiate the mocked variation.
- They should be placed in the same directory as the functionality itself and should follow the pattern [filename].test.tsx
- They should be added or edited on bug fixes, logic related features and refactorings.

### Component tests

- They are testing the UI and basic functionality of single react components.
- They are written with the jest testing framework.
- Data should be provided in the tests and no network calls should be made.
- They test, if the relevant information is shown in the correct way.
- They test all different functionality of the component, e.g. clickable buttons, text inputs, navigation controls
- We pay special attention to the state management of a component, e.g. if a component kept its state after closing a dialog popup or if the data has been updated correctly after an update of some parts of it
- They should be added for all new or edited frontend components.

### End-to-End tests (E2E tests)

- we use cypress for E2E tests.
- E2E tests are located in src/cypress/e2e and are called [testCase]Test.spec.tsx.
- They are costly and should be used sparingly.
- They are used for happypaths only, testing the most common usages and not all the edge cases.
- They should guarantee the correct working of the application as a whole.
- They will use network communication and a docker setup as defined in `docker-compose/compose.test.yml`
- We will ask for creation separately, as they are fairly complex. Please hint, if a e2e test might be relevant in the current code.

## Accessibility

- Interactive elements must have appropriate ARIA attributes
- Components should be keyboard navigable
- Use semantic HTML elements
- Meet WCAG 2.1 AA color contrast standards
- Add alt text for images and aria-labels for SVGs
- Form elements must have proper labels and error messages

## Dependencies

- Use yarn as package manager
- Our project is open source

## Versioning

- Follow semantic commit messages pattern
- Code is hosted on GitHub
