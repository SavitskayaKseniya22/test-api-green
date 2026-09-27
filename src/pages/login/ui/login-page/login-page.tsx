import { CustomAnchorLink } from "@/shared/ui/link";
import { SignInForm } from "../sign-in-form/sign-in-form";
import styles from "./login-page.module.scss";

export function LoginPage() {
    return (
        <main className={styles.page}>
            <div className={styles.page__content}>
                <div className={styles.page__form}>
                    <h1>Подключитесь к WhatsApp</h1>

                    <SignInForm />
                </div>
                <CustomAnchorLink href="https://green-api.com/" target="_blank">
                    Нет реквизитов?
                </CustomAnchorLink>
            </div>
        </main>
    );
}
