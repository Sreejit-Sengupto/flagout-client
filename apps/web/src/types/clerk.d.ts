// Type declaration for Clerk global object
interface ClerkSession {
    getToken: () => Promise<string | null>;
}

interface Clerk {
    session: ClerkSession | null;
}

declare global {
    interface Window {
        Clerk?: Clerk;
    }
}

export { };
