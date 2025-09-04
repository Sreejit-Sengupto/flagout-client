# flag0ut - Smart Feature Flag Management

flag0ut is a powerful feature flag management tool designed for modern development teams. It provides a centralized dashboard to manage, monitor, and optimize feature rollouts with ease. With features like percentage-based rollouts, role-based targeting, and AI-powered insights, flag0ut empowers developers to ship features fearlessly.

## Live Demo

You can check out the live demo of the application [here](https://flag0ut.vercel.app/).

## Features

- **User Authentication:** Secure user authentication powered by Clerk.
- **Feature Flag Management:** Full CRUD functionality for feature flags.
- **Percentage-based Rollouts:** Gradually release features to a specific percentage of your users.
- **Role-based Targeting:** Target specific user segments like `BETA`, `INTERNAL`, or `PREMIUM` users.
- **API Key Management:** Generate and manage API keys to securely interact with the flag0ut API.
- **Recent Activity Tracking:** Keep track of all the changes made to your feature flags.
- **Dashboard:** An intuitive dashboard with key metrics and recent activity.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **API Communication:** [TanStack Query](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Schema Validation:** [Zod](https://zod.dev/)

## Project Structure

The project follows a standard Next.js App Router structure.

```
/src
├── app
│   ├── (authenticated)   # Protected routes
│   ├── (unauthenticated) # Public routes
│   └── api               # API routes
├── components
│   ├── application       # Application-specific components
│   └── ui                # Reusable UI components
├── context             # React context providers
└── lib                 # Libraries, helpers, and utilities
    ├── axios           # Axios instance configuration
    ├── tanstack        # TanStack Query configuration
    │   ├── api         # API call definitions
    │   └── hooks       # Custom hooks for API calls
    └── zod-schemas     # Zod schemas for validation
```

## API Endpoints

### Evaluate a Feature Flag

This endpoint allows you to evaluate a feature flag for a given user.

- **URL:** `/api/v1/flags/evaluate`
- **Method:** `GET`
- **Headers:**
    - `X-flagout-key`: Your API key.
- **Query Parameters:**
    - `slug` (string, required): The slug of the feature flag.
    - `user_role` (string, optional): The role of the user (e.g., `BETA`, `PREMIUM`).
    - `user_id` (string, required): A unique identifier for the user.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Sreejit-Sengupto/flagout.git
    cd flagout/client
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the `client` directory and add the following environment variables:

    ```env
    DATABASE_URL="your_postgresql_database_url"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    ```

4.  **Run database migrations:**

    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

## Coding Patterns

This project follows a structured approach for making API calls and managing server state, primarily using TanStack Query.

1.  **API Call Definition:**

    All API calls are defined in the `src/lib/tanstack/api` directory. Each file corresponds to a specific resource (e.g., `feature-flag.ts`, `api-key.ts`). These functions use an `axios` instance and define the return types for the API responses.

2.  **TanStack Query Hooks:**

    For each API call, a corresponding custom hook is created in the `src/lib/tanstack/hooks` directory. These hooks use the `useQuery` or `useMutation` hooks from TanStack Query to manage the server state, caching, and re-fetching logic.

3.  **Component Usage:**

    Components then use these custom hooks to fetch and display data, or to trigger mutations. This pattern keeps the data fetching logic separate from the UI components, making the code more modular and easier to maintain.

4.  **Schema Validation:**

    [Zod](https://zod.dev/) is used for schema validation on both the client and server sides. Zod schemas are defined in the `src/lib/zod-schemas` directory.

5.  **Custom API Errors:**

    A custom `ApiError` class is used to handle API errors in a structured way. This allows for consistent error handling across the application.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
