# TypeScript Style Guide

## General

- Use TypeScript strict mode (`"strict": true` in tsconfig.json)
- Prefer `const` over `let`; never use `var`
- Use template literals over string concatenation
- Use optional chaining (`?.`) and nullish coalescing (`??`)

## Naming Conventions

- **Files/directories**: kebab-case (`user-profile.ts`, `auth-service.ts`)
- **Components**: PascalCase (`UserProfile.tsx`)
- **Variables/functions**: camelCase (`getUserById`, `isActive`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PARTICIPANTS`, `DEFAULT_POINTS`)
- **Types/Interfaces**: PascalCase (`User`, `BetEntry`)
- **Enums**: PascalCase for name, PascalCase for members

## Types

- Prefer `interface` for object shapes, `type` for unions/intersections
- Avoid `any`; use `unknown` when type is truly unknown
- Use explicit return types for exported functions
- Prefer discriminated unions over optional fields for variants

## Functions

- Prefer arrow functions for callbacks and inline functions
- Use named function declarations for top-level exported functions
- Keep functions small and focused (single responsibility)
- Prefer early returns to reduce nesting

## Imports

- Use named imports over default imports where possible
- Group imports: external libs, then internal modules, then relative paths
- Use path aliases (`@/`) for project imports

## React / Next.js Specific

- Use functional components exclusively
- Prefer Server Components by default; use `"use client"` only when needed
- Keep components small; extract logic into custom hooks
- Use `className` with Tailwind or CSS modules (to be decided)
- Colocate component-specific types in the same file

## Error Handling

- Use try/catch for async operations at boundaries
- Prefer Result/Either patterns for business logic errors when appropriate
- Always handle promise rejections
- Log errors with meaningful context

## Testing

- Use descriptive test names: `it("should calculate score for gold tier category")`
- Prefer `describe` blocks to group related tests
- Use factories or builders for test data, not raw objects
- Mock external dependencies, not internal modules
