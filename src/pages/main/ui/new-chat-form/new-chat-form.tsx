import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./new-chat-form.module.scss";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

const schema = z.object({
    phone: z
        .string()
        .trim()
        .regex(/^\+?[1-9]\d{6,14}$/, "Введите от 7 до 15 цифр с кодом страны, без пробелов."),
});

export default function NewChatForm({ onCreate }: { onCreate: (phone: string) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

    return (
        <form
            className={styles.form}
            onSubmit={event => {
                void handleSubmit(({ phone }) => onCreate(`+${phone.replace(/^\+/, "")}`))(event);
            }}
            noValidate>
            <Input
                type="tel"
                placeholder="+79000000001"
                {...register("phone")}
                label={"Номер получателя, зарегистрированный в WhatsApp"}
                errorMessage={errors.phone?.message}
            />

            <Button type="submit" view="secondary">
                Создать чат
            </Button>
        </form>
    );
}
