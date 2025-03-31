## Project Structure
- Frontend is built with Next.js 14+, using the App Router
- Translations are in src/locale/[lang].json files (we are currently transferring from react-intl to next-intl)
- Components are in src/components
- Page components are in src/app/[locale]/...

## Code Style
- We use TypeScript for all new code
- We prefer functional components with hooks over class components
- We use Material-UI (MUI) for our UI components
- we use single quotes

## State Management
- We use React Context for global state where needed
- We prefer local component state when possible

## API Integration
- RESTful API communication is handled via fetch
- Backend API integrations should include proper error handling
- All frontend-backend communication is wrapped in `apiResponseWrapper.ts` to ensure correct typing. It also helps with error handling.
- The primary call from the frontend to the backend should be a stateless async function in a file ending in `Actions.ts` in the `src/lib/services` directory. The file should be marked with `use server;` at the top of the file.

## Documentation
- Add JSDoc comments for exported functions and components
- Include detailed PR descriptions with test coverage information

## Testing
- Unit tests should be placed next to the components they test
- Test files should follow the pattern [filename].test.tsx
- we use cypress for E2E tests
- E2E tests are located in src/cypress/e2e and are called [testCase]Test.spec.tsx

## Accessibility
- All interactive elements must have appropriate ARIA attributes
- Components should be keyboard navigable
- Use semantic HTML elements when possible
- Color contrast should meet WCAG 2.1 AA standards
- Images should have alt text and SVGs should have aria-label where appropriate
- Form elements must have proper labels and error messages

## Dependencies
- we use yarn as package manager
- our project is open source

## Versioning
- our branches and commit messages should follow the semantic commit messages pattern
- our code is located on GitHub