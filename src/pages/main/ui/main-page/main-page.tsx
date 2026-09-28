import { useModal } from "@/shared/ui/modal";
import { useDispatch, useSelector } from "react-redux";
import { addChat, selectChat, selectChatPhones, selectActivePhone, selectMessages } from "../../model/chats-slice";
import { logout } from "@/entities/session";
import NewChatForm from "../new-chat-form/new-chat-form";
import styles from "./main-page.module.scss";
import { Button } from "@/shared/ui/button";
import clsx from "clsx";
import Chat from "../chat/chat";
import { useReceiveMessages } from "../../model/use-receive-messages";

export default function MainPage() {
    const receiveError = useReceiveMessages();
    const { openModal, closeModal } = useModal();
    const dispatch = useDispatch();
    const chats = useSelector(selectChatPhones);
    const activeChat = useSelector(selectActivePhone);
    const messages = useSelector(selectMessages);

    const handleNewChat = () => {
        openModal({
            title: "Новый чат",
            content: (
                <NewChatForm
                    onCreate={phone => {
                        dispatch(addChat(phone));
                        closeModal();
                    }}
                />
            ),
        });
    };

    return (
        <main className={styles.page}>
            <aside className={styles.page__profile}>
                <Button
                    type="button"
                    view="transparent"
                    size="small"
                    onClick={() => {
                        closeModal();
                        dispatch(logout());
                    }}>
                    Выйти
                </Button>
            </aside>
            <aside className={styles.page__sidebar}>
                <header className={styles.page__heading}>
                    <h1>Чаты</h1>
                    <Button view="secondary" type="button" onClick={handleNewChat}>
                        ＋ Новый чат
                    </Button>
                </header>
                <div
                    className={clsx(styles.page__list, {
                        [styles[`page__list--empty`]]: chats.length === 0,
                    })}>
                    {chats.length === 0 ? (
                        <div className={styles.page__welcome}>
                            <h2>Начните общение</h2>
                            <p>Создайте первый чат по номеру телефона</p>
                        </div>
                    ) : (
                        chats.map(phone => {
                            const lastMessage = messages?.[phone]?.at(-1);
                            return (
                                <button
                                    key={phone}
                                    type="button"
                                    className={styles.page__chat}
                                    onClick={() => dispatch(selectChat(phone))}>
                                    <span className={styles["page__chat-content"]}>
                                        <span>{phone}</span>
                                        <span className={styles.page__preview}>
                                            {lastMessage
                                                ? `${lastMessage.direction === "outgoing" ? "Вы: " : ""}${lastMessage.text}`
                                                : "Пока нет сообщений"}
                                        </span>
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>
            </aside>
            <section className={styles.page__conversation}>
                {receiveError && <p>{receiveError}</p>}
                {activeChat ? (
                    <Chat key={activeChat} phone={activeChat} />
                ) : (
                    <div className={styles.page__welcome}>
                        <h2>Ваши разговоры — здесь</h2>
                        <p>
                            Выберите чат слева или создайте новый,
                            <br />
                            чтобы начать переписку
                        </p>
                        <Button type="button" view="tertiary" onClick={handleNewChat}>
                            Создать чат
                        </Button>
                    </div>
                )}
            </section>
        </main>
    );
}
