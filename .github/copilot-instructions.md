## Project Structure
- Frontend is built with Next.js 14+, using the App Router
- Translations are in src/locale/[lang].json files 
- We are currently transferring from react-intl to next-intl
- Components are in src/components
- Page components are in src/app/[locale]/...

## Code Style
- We use TypeScript for all new code
- We prefer functional components with hooks over class components
- We use absolute imports instead of relative imports
- We prefer normal functions over arrow functionsfor better readability
- We use Material-UI (MUI) for our UI components
- we use single quotes
- see eslint.config.js

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
- documentation can be added in docs/ and wiki/

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
- We pay special attention to the state management of a component, e.g. if a component kept its state after closing  a dialog popup or if the data has been updated correctly after an update of some  parts of it
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