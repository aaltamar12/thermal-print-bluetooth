import { Dialog } from "@capacitor/dialog";
import { validateDevice } from "./storageHelper";

export async function newDialog(title, message) {
    try {
        let result;
        const device = await validateDevice()

        if (device) {
            result = webDialog(title, message);
        } else {
            result = await mobileDialog(title, message);
        }

        return result;

    } catch (error) {
        console.error("Error en el dialogo", error);
    }
}

const webDialog = (title, message) => {
    const result = prompt(message);
    return { value: result };
}

const mobileDialog = async (title, message) => {
    try {
        const dialog = await Dialog.prompt({
            title,
            message,
        });

        return dialog;

    } catch (error) {
        console.error("Error en el dialogo mobile", error);
    }
}