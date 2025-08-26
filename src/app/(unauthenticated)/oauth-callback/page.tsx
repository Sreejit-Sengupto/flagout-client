import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function OAuthCallbackPage() {
    return (
        <>
            <div id="clerk-captcha"></div>
            <AuthenticateWithRedirectCallback />
        </>
    );
}
