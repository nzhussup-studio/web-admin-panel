# Web Admin Panel

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Jest](https://img.shields.io/badge/Jest-30-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub_Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-client%20generation-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)](https://www.openapis.org/)

## Overview

This repository contains the web-based administration interface for managing the content behind `nzhussup.dev`. It is intended for authenticated internal use and provides a single place to create, update, organize, and remove structured data that is later consumed by the public-facing website and related services.

The project focuses on operational content management rather than public presentation. Its purpose is to reduce manual data maintenance, standardize editing workflows, and provide a stable UI for administrative tasks across multiple content domains.

## Scope

The admin panel currently covers these areas:

- authentication and protected access for administrative users
- project management
- CV data management, including work experience, education, skills, and certifications
- album and image management
- administrative user management
- CV generation workflows based on maintained data

## Technology Stack

The application is built as a frontend SPA with the following main technologies:

- React 18 for the UI layer
- TypeScript for application code and typing
- Vite for local development and production builds
- React Router for navigation
- Bootstrap and React Bootstrap for layout and components
- Axios-based API clients generated from OpenAPI definitions
- Jest and Testing Library for automated tests

## Repository Structure

```text
.
├── admin-panel/          # Frontend application source code
├── .github/workflows/    # CI/CD and release workflows
├── CHANGELOG.md          # Release history
└── RELEASE_GUIDE.md      # Release process and versioning notes
```

Within `admin-panel/`, the codebase is organized into pages, reusable components, hooks, providers, generated API clients, and test suites.

## Purpose in the Overall System

This repository contains only the web admin client. It is one part of a larger system and communicates with backend APIs that are maintained separately. The panel itself is responsible for:

- presenting administrative workflows in the browser
- validating and submitting user input
- calling backend endpoints for CRUD operations
- enforcing authenticated access on the client side
- supporting deployment through container-based CI/CD workflows

## Local Development

```bash
cd admin-panel
npm ci
npm run dev
```

Useful commands:

```bash
npm test
npm run build
npm run typecheck
npm run lint
```

## CI/CD

GitHub Actions workflows in `.github/workflows/` are used for:

- running automated tests
- building the production image
- publishing tagged releases
- deploying the application

## Related Documentation

- [Release Guide](./RELEASE_GUIDE.md)
- [Changelog](./CHANGELOG.md)
