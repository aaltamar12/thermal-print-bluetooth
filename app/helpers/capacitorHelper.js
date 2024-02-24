import { Dialog } from "@capacitor/dialog";
import { validateDevice } from "./storageHelper";

export async function newDialog(title, message) {
    if (await validateDevice()) {
        return webDialog(title, message);
    } else {
        return mobileDialog(title, message);
    }
}

const webDialog = (title, message) => {
    const result = prompt(message);
    return { value: result };
}

const mobileDialog = async (title, message) => {
    const dialog = await Dialog.prompt({
        title,
        message,
    });

    return dialog;
}