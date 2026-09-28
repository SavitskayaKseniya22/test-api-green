import clsx from "clsx";
import type { ChatMessage } from "../../model/message";
import styles from "./message.module.scss";

export default function Message({ message }: { message: ChatMessage }) {
    return (
        <article className={clsx(styles.message, { [styles["message--outgoing"]]: message.direction === "outgoing" })}>
            <p>{message.text}</p>
            <footer>
                <time dateTime={new Date(message.timestamp).toISOString()}>
                    {new Date(message.timestamp).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                </time>
            </footer>
        </article>
    );
}
