# Boveda-Lens: Proposed Angular Application Structure

This document outlines the proposed file structure for migrating the Boveda-Lens frontend to Angular. The structure is designed to be modular, scalable, and maintainable, following modern Angular (v20+) best practices, including standalone components and domain-driven naming conventions.

This plan breaks down the monolithic `script.js` and `index.html` files into a logical hierarchy of components, services, and data models, incorporating a more generalized "Record" terminology.

---

## 1. Core Application & Layout

These files establish the main application shell, routing, and overall page layout. They are the foundation of the Angular application.

- `app/app.config.ts`: The main application configuration file. It will register providers for routing, HTTP client functionality, and other core services.
- `app/app.routes.ts`: Defines the application's top-level routes, such as `/dashboard`, `/records`, and `/records/:id`.
- `app/app.ts`: The root component of the application. It will contain the main layout, including the header, a persistent sidebar, and a `<router-outlet>` to render page components.
- `app/layout/header.ts`: A clean header component containing the logo, breadcrumbs, and a user profile dropdown.
- `app/layout/sidebar.ts`: A persistent, minimizable sidebar for primary navigation (e.g., links to Dashboard and Records).
- `app/layout/footer.ts`: A simple, reusable component for the site footer.

---

## 2. Page Components (Routes)

Page components are the top-level components for each route defined in `app.routes.ts`. They act as containers and orchestrators for the feature components that make up a specific page.

- `app/pages/dashboard.ts`: The main dashboard page, which will contain the `DashboardStats` component for a high-level overview.
- `app/pages/records.ts`: The main page for managing records. It will compose the `RecordListControls` and `RecordList` components.
- `app/pages/record-detail.ts`: This page displays the full details of a single record. It will be activated when a user navigates to a URL like `/records/123` and will contain the various detail-oriented sub-components.

---

## 3. Feature Components

These are the individual, reusable UI blocks that build the pages. Each component has a specific responsibility, making the UI easier to manage and test.

- `app/features/dashboard-stats.ts`: A component to display the tabbed statistical overview card (Total Records, Top Diagnoses, etc.).
- `app/features/record-list-controls.ts`: A component for the control bar above the record list, containing the search input, filter dropdown, and sort controls.

* `app/features/record-list.ts`: The component responsible for rendering the table of records, handling row selection, managing "select all" functionality, and displaying pagination controls.

- `app/features/pdf-upload-modal.ts`: The component for the multi-step "Create from PDF" modal. It will manage its own internal state for the stepper and file upload process.
- `app/features/record-detail-sidebar.ts`: A component for the sidebar on the record detail page, showing subject demographics and key information like allergies.
- `app/features/record-summary.ts`: A component for the "Summary" tab within the record detail view, showing key findings and medications.
- `app/features/record-consultations.ts`: A component for rendering the list of medical consultations in its own tab.
- `app/features/record-labs.ts`: A component for rendering the list of lab results in its own tab.
- `app/features/record-radiology.ts`: A component for rendering the list of radiology reports in its own tab.
- `app/features/record-sponsor.ts`: A component for rendering the sponsor's information in its own tab.

---

## 4. Services (Data & Logic)

Services encapsulate business logic, API interactions, and state management. They are injected into components, separating the concerns of data handling from the UI.

- `app/services/record-api.ts`: This service will be responsible for all HTTP requests related to record data, such as fetching, creating, updating, and deleting records via the `/api/records` endpoint.
- `app/services/extraction-api.ts`: This service will handle the PDF upload and AI processing logic by communicating with the `/api/extraction` endpoint.
- `app/services/record-state.ts`: A client-side state management service. It will use Angular Signals to hold the current list of records, the selected record, and UI state like filter/sort criteria, providing a single source of truth for the application.

---

## 5. Data Models (Interfaces)

Defining clear data models with TypeScript interfaces is crucial for ensuring type safety and improving developer experience.

- `app/models/record.ts`: This file will contain TypeScript interfaces that define the shape of a `Record` object and all its nested structures (e.g., `PatientInfo`, `Summary`, `MedicalEncounter`, `SponsorInfo`). It can also define a `RecordType` enum (`'patient'`, `'dependent'`, etc.).
- `app/models/api.ts`: This file will contain interfaces for API-related structures, such as request parameters (for pagination and sorting) and standardized API response formats.

---

This proposed structure provides a solid foundation for a scalable and maintainable Angular application, making the migration process clear and organized.
