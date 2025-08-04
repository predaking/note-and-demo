import { useEffect, useTransition } from "react";

const Chat = () => {
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            await new Promise(resolve => setTimeout(resolve, 3000));
        });
    }, []);

    return (
        <div>{isPending ? 'loading...' : 'loaded'}</div>
    );
}

export default Chat;