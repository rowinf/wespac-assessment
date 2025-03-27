import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export function Welcome() {
    const location = useLocation()
    const [isAccountCreated, setIsAccountCreated] = useState(() => {
        if (location.state === 'account-created') {
            return true;
        }
        return false;
    })
    useEffect(() => {
        if (location.state === 'account-created') {
            window.history.replaceState({}, '')
        }
    }, []);
    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            {isAccountCreated ?
                <article className="hint">
                    <strong>Account successfully created </strong><button onClick={() => setIsAccountCreated(false)}>dismiss</button>
                </article>
                : null}
            <a href="/create">Create an account</a>
        </main>
    );
}
