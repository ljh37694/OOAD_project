# System Overview - Subscription Management Application (SMA)

This document provides an overview of the system architecture, components, and features of the Subscription Management Application. It is maintained and updated automatically as the project evolves.

## 🏗 System Architecture

The application follows a classic client-server architecture:
- **Frontend**: A single-page application (SPA) built with React and Vite.
- **Backend**: A RESTful API built with Spring Boot.
- **Database**: MySQL for persistent storage.

---

## 💻 Frontend (Client)

The frontend is responsible for the user interface and interaction.

### Tech Stack
- **Core**: React, TypeScript, Vite
- **Styling**: Tailwind CSS (v4)
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Key Components & Pages
- **`App.tsx`**: Main entry point and routing configuration.
- **`Dashboard.tsx`**: Displays total spending and navigation to the calendar.
- **`SubscriptionList.tsx`**: Lists user subscriptions with search and hashtag filtering.
- **`AddSubscription.tsx`**: Form to add new subscriptions with start date and billing cycle.
- **`EditSubscription.tsx`**: Form to edit existing subscriptions.
- **`CalendarView.tsx`**: Displays a calendar with payment histories and future schedules.
- **`SubscriptionDetailModal.tsx`**: Detailed view of a subscription with Pause/Activate flow.

### State Management
- **`AuthContext.tsx`**: Manages user authentication state.
- **`SubscriptionContext.tsx`**: Manages subscriptions, templates, and categories.

---

## ⚙️ Backend (Server)

The backend handles business logic, database interactions, and authentication.

### Tech Stack
- **Framework**: Spring Boot (Java 24)
- **Database**: MySQL
- **ORM**: Spring Data JPA / Hibernate

### Key Controllers & APIs
- **`SubscriptionController.java`**: Handles CRUD operations for subscriptions and seeds payment histories.
- **`CustomTemplateController.java`**: Manages custom service templates.
- **`PaymentHistory`**: Entity managing past (PAID) and future (SCHEDULED) payments.

---

## 🚀 Key Features

1. **Dashboard**: Quick view of monthly spending.
2. **Subscription Management**: Add, edit, delete, and toggle (Pause/Activate) subscriptions.
3. **Hashtag Filtering**: Filter subscriptions by categories (hashtags) on the list page.
4. **Calendar View**: Visual representation of payment dates and amounts.
5. **Interactive Modals**: Detailed views and confirmation flows for pausing/activating.

---
*Last Updated: 2026-05-23*
