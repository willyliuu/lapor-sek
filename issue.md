# LaporSek Backend & Database Setup Tasks

This document contains high-level planning tasks for setting up and configuring the database and ORM backend for the **LaporSek** project.

The setup should align with the database model requirements outlined in [prd.md](file:///Users/willyliu/Documents/Code/Projects/lapor-sek/prd.md).

---

## Phase 1: Database Infrastructure

### Task 1.1: Local PostgreSQL Docker Setup
- Create a `docker-compose.yml` file to spin up a local **PostgreSQL** database container.
- Set up a `.env.local` file with the necessary database connection variables (e.g., host, port, user, password, database name).

---

## Phase 2: Drizzle ORM Configuration & Schema

### Task 2.1: Dependencies Installation
- Install ORM libraries: `drizzle-orm` and a PostgreSQL client package (e.g., `postgres` or `pg`).
- Install dev dependencies: `drizzle-kit` and `@types/pg` (if using `pg`).

### Task 2.2: Drizzle Project Configuration
- Configure `drizzle.config.ts` specifying the schema location, migrations output folder, and database credentials retrieved from environment variables.
- Establish a database connection client module (e.g., `src/db/index.ts`).

### Task 2.3: Database Schema Definitions
- Define database table schemas matching the PRD data model in TypeScript (e.g., `src/db/schema.ts`):
  - **`issues`** table: id, created_at, title (max 100), description, category (enum), status (enum), lat, lng, address, photo_url, upvote_count, is_flagged.
  - **`upvotes`** table: id, issue_id (foreign key referencing `issues.id` with cascade deletion), created_at.
  - **`reports`** table: id, issue_id (foreign key referencing `issues.id` with cascade deletion), created_at.

---

## Phase 3: Migrations, Seeding, & Tooling

### Task 3.1: Generating & Running Migrations
- Generate initial SQL migration files using Drizzle Kit CLI.
- Apply migrations to the local PostgreSQL instance.

### Task 3.2: Database Seeding
- Create a seed script (e.g., `src/db/seed.ts` or `npm run db:seed`) to populate the tables with sample records.
- Ensure the seed data includes several realistic issue reports across various categories (`road_damage`, `flooding`, `lighting`, etc.) with mock locations.

### Task 3.3: Drizzle Studio
- Set up a command shortcut in `package.json` to launch **Drizzle Studio** locally (`npx drizzle-kit studio`) for inspecting the database structure and data.
