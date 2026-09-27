import type { ComponentProps } from "react";
import { Link, type LinkProps } from "react-router-dom";
import clsx from "clsx";
import styles from "./link.module.scss";

function getClasses(className?: string) {
    return clsx(styles.link, className);
}

type CustomLinkProperties = LinkProps & {
    disabled?: boolean;
};

export function CustomLink({
    className,
    children,

    disabled = false,
    ...properties
}: CustomLinkProperties) {
    return (
        <Link
            {...properties}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : properties.tabIndex}
            className={getClasses(className)}>
            {children}
        </Link>
    );
}

type AnchorProperties = ComponentProps<"a"> & {
    disabled?: boolean;
};

export function CustomAnchorLink({ className, children, disabled = false, ...properties }: AnchorProperties) {
    return (
        <a
            {...properties}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : properties.tabIndex}

            className={getClasses(className)}>
            {children}
        </a>
    );
}

type LinkButtonProperties = ComponentProps<"button">;

export function CustomButtonAsLink({ className, children, ...properties }: LinkButtonProperties) {
    return (
        <button type="button" {...properties} className={getClasses(className)}>
            {children}
        </button>
    );
}
