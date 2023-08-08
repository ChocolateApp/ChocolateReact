import { Store } from 'react-notifications-component'

export function Error({ title, message }) {
    Store.addNotification({
        title: title ?? "Error",
        message: message ?? "An error has occurred",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}

export function Success({ title, message }) {
    Store.addNotification({
        title: title ?? "Success",
        message: message ?? "Success",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}

export function Warning({ title, message }) {
    Store.addNotification({
        title: title ?? "Warning",
        message: message ?? "Warning",
        type: "warning",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}

export function Info({ title, message }) {
    Store.addNotification({
        title: title ?? "Info",
        message: message ?? "Info",
        type: "info",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}

export function Default({ title, message }) {
    Store.addNotification({
        title: title ?? "Default",
        message: message ?? "Default",
        type: "default",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}