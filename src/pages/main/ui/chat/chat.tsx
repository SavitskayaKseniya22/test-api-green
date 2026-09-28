import styles from "./chat.module.scss";
import InputExpanded from "@/pages/main/ui/input-expanded/input-expanded";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectMessages } from "../../model/chats-slice";
import Message from "../message/message";

export default function Chat({ phone }: { phone: string }) {
    const messages = useSelector(selectMessages)?.[phone];
    const endReference = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endReference.current?.scrollIntoView({ block: "end" });
    }, [messages?.length]);

    return (
        <div className={styles.chat}>
            <header className={styles.chat__header}>
                <p>{phone}</p>
            </header>
            <div className={styles.chat__messages}>
                {messages?.length ? (
                    messages.map(message => <Message key={message.id} message={message} />)
                ) : (
                    <p>Пока нет сообщений</p>
                )}
                <div ref={endReference} />
            </div>
            <InputExpanded phone={phone} />
        </div>
    );
}
