# PokemonBattle

| ID    | Functional Requirement       | Description                                                                                                                   | Status      |
| ----- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| FR001 | Group Project                | Develop the application collaboratively; share tasks evenly.                                                                  | In Progress |
| FR002 | Follow Group-Work Guidelines | Comply with bootcamp best-practices for teamwork.                                                                             | In Progress |
| FR003 | Single Public Repo           | Keep one repository that contains both client and server code (full-stack). Instructors should not be added as collaborators. |
| FR004 | PR-Based Workflow            | Merge all changes into main through reviewed Pull Requests.                                                                   | In Progress |

App Framework & Runtime

| ID    | Functional Requirement | Description                                                                                                                               | Status      |
| ----- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| FR005 | Framework Choice       | Implement the stack with either:• Next .js using React Server Components (RSC) or React Router in Framework Mode (data loaders & actions) | Done |
| FR006 | TypeScript Everywhere  | Configure TypeScript for both browser and server code.                                                                                    | Partially done |
| FR007 | Environment Variables  | Manage secrets (DB string, PokeAPI base URL, etc.) via .env and framework-specific env helpers.                                           | Partially done |

Database & Data Layer

| ID    | Functional Requirement | Description                                                                                           | Status      |
| ----- | ---------------------- | ----------------------------------------------------------------------------------------------------- | ----------- |
| FR008 | Cloud DB               | Provisioning Spin up a PostgreSQL (Neon) In Progress                                                  | Done |
| FR009 | Leaderboard Model      | Create a leaderboard schema with: id/\_id, username (NOT NULL), score (NOT NULL), date (default Now). | In Progress |

Data fetching and Mutations

| ID    | Functional Requirement | Description                                                                   | Status      |
| ----- | ---------------------- | ----------------------------------------------------------------------------- | ----------- |
| FR011 | Retrieve leaderboard   | Return all scores ordered by highest first.                                   | In Progress |
| FR012 | Add to leaderboard     | Accept { username, score }, validate, write to DB, and return the new record. | In Progress |

(In Next.js, implement this using RSC and Server Actions; in React Router framework mode, use Loaders and Actions)

Front-End Features (Shared Regardless of Framework)

| ID    | Functional Requirement   | Description                                                                                                                      | Status      |
| ----- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| FR014 | Route Map                | Implement navigation for:Home, Pokémon Details, My Roster, Battle, Leaderboard. Use the selected framework’s routing primitives. | Done |
| FR015 | Home Page – Pokémon List | Fetch Pokémon from PokeAPI, list them as cards; each card links to /pokemon/:id.                                                 | Done |
| FR016 | Pokémon Details Page     | Show stats, types, abilities; include “Add to Roster”.                                                                           | Partially done |
| FR017 | My Roster Page           | Display chosen Pokémon; allow removals; persist roster (localStorage or DB).                                                     | In Progress |
| FR018 | Battle Page              | Let users battle a random Pokémon using simple type/stat logic; track wins, losses, XP.                                          | Partially done |
| FR019 | Leaderboard Page         | Fetch scores (leaderboard); after a battle, prompt for name and post new score (leaderboard).                                    | In Progress |
| FR020 | Form Validation          | Validate all user inputs with Zod (e.g., username, roster changes) before submission.                                            | In Progress |
| FR021 | Responsive Styling       | Style with Tailwind CSS and ensure usability on mobile & desktop.                                                                | Partially done |
