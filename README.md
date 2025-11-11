# flag0ut - Smart Feature Flag Management
![app-image](https://ik.imagekit.io/8oxweuidq/Screenshot%20from%202025-09-14%2014-10-10.png?updatedAt=1762834043299)

flag0ut is a powerful feature flag management tool designed for modern development teams. It provides a centralized dashboard to manage, monitor, and optimize feature rollouts with ease. With features like percentage-based rollouts, role-based targeting, and AI-powered insights, flag0ut empowers developers to ship features fearlessly.

[Learn how to use](#how-to)

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

## How To?

1. Sign up on [flag0ut](https://flag0ut.vercel.app) and generate an API Key.
2. Add your app’s URL under the appropriate environment field.
   For example, if you’re testing locally, use `http://localhost:3000/` in the `Development` field.
   This ensures that your feature flags can only be accessed from the specified origins and environments — preventing unauthorized usage elsewhere.
3. Create a Feature Flag and copy the slug.
4. Install the Typescritp SDK
    ```bash
    npm install flag0ut
    ```
5. Initialize the SDK with your API Key

    ```typescript
    import Flagout from flagout;

    const flagoutClient = new Flagout({
        apiKey: "YOUR_API_KEY"
    })
    ```

6. Then, you can evaluate a feature flag using the `evaluate` method -
    ```typescript
    const { showFeature } = flagoutClient.evaluate("feature-flag-slug");
    ```
7. You can also specify a user role and ID to evaluate the flag for a specific user:
    ```typescript
    const { showFeature } = flagoutClient.evaluate(
        "feature-flag-slug",
        "BETA",
        "user@123",
    );
    ```
8. Conditionally render your component based on the `showFeature` value:
    ```typescript
    const App = () => {
        return (
            showFeature ? <FeaturePage/> : <EmptyState/>
        )
    }
    export default App;
    ```

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **API Communication:** [TanStack Query](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Schema Validation:** [Zod](https://zod.dev/)

## Folder Structure

```
/
├───.dockerignore
├───.gitignore
├───.prettierignore
├───.prettierrc
├───components.json
├───compose.yaml
├───Dockerfile
├───eslint.config.mjs
├───next.config.ts
├───package-lock.json
├───package.json
├───postcss.config.mjs
├───README.md
├───tsconfig.json
├───.git/...
├───.github/
│   └───workflows/
│       ├───build_push_image.yaml
│       └───format_lint.yaml
├───.next/...
├───node_modules/...
├───prisma/
│   ├───schema.prisma
│   └───migrations/
│       └───...
├───public/
│   ├───app_dashboard.png
│   ├───dashboard.png
│   ├───f0_logo.png
│   ├───file.svg
│   ├───globe.svg
│   ├───next.svg
│   ├───pixel_hero.gif
│   ├───profile_fallback.png
│   ├───vercel.svg
│   └───window.svg
└───src/
    ├───middleware.ts
    ├───app/
    │   ├───favicon_1.ico
    │   ├───favicon.ico
    │   ├───globals.css
    │   ├───layout.tsx
    │   ├───page.tsx
    │   ├───(authenticated)/
    │   │   ├───layout.tsx
    │   │   ├───feature-flags/
    │   │   │   ├───page.tsx
    │   │   │   └───[slug]/
    │   │   ├───profile/
    │   │   ├───recent-activities/
    │   │   ├───settings/
    │   │   └───workplace/
    │   ├───(public)/
    │   │   └───pricing/
    │   ├───(unauthenticated)/
    │   │   ├───layout.tsx
    │   │   ├───login/
    │   │   ├───oauth-callback/
    │   │   ├───register/
    │   │   └───reset-password/
    │   ├───actions/
    │   │   ├───ai-summary.action.ts
    │   │   ├───flag.action.ts
    │   │   ├───gen-ai.ts
    │   │   └───revalidate-user.action.ts
    │   └───api/
    │       └───v1/
    ├───components/
    │   ├───application/
    │   │   ├───emtpy-state.tsx
    │   │   ├───logo.tsx
    │   │   ├───pagination-bar.tsx
    │   │   ├───sidebar.tsx
    │   │   ├───authentication/
    │   │   ├───charts/
    │   │   ├───feature-flags/
    │   │   ├───flag-metrics/
    │   │   ├───landing-page/
    │   │   ├───profile/
    │   │   ├───recent-activities/
    │   │   ├───settings/
    │   │   └───workplace/
    │   └───ui/
    │       ├───...
    ├───context/
    │   ├───tanstack-provider.tsx
    │   └───theme-provider.tsx
    └───lib/
        ├───api-error.ts
        ├───constants.ts
        ├───debounce.ts
        ├───format-number.tsx
        ├───prisma.ts
        ├───time-date.tsx
        ├───utils.ts
        ├───api-utils/
        │   └───user-bucket.ts
        ├───axios/
        │   └───index.ts
        ├───gen-ai/
        │   └───init.ts
        ├───middleware/
        │   └───secure-api.ts
        ├───sonner/
        │   └───index.ts
        ├───tanstack/
        │   ├───keys.ts
        │   ├───query-client.ts
        │   ├───api/
        │   └───hooks/
        └───zod-schemas/
            ├───api-key.ts
            ├───feature-flags.ts
            ├───flag-env.ts
            └───recent-activity.ts
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

    This will start the development server with Turbopack. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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
