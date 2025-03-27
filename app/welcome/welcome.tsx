import { useLocation } from "react-router";

export function Welcome() {
    const location = useLocation()
    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            {location.state === 'account-created' ? 'Success!' : null}
            <a href="/create">Create an account</a>
        </main>
    );
}
