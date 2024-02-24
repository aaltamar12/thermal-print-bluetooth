import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { Preferences } from "@capacitor/preferences";
import { Device } from "@capacitor/device";

export async function setCookieNext(name, value) {
    if (await validateDevice()) {
        setCookie(name, value);
    } else {
        setObject(name, value);
    }
}

export async function getCookieNext(name) {
    try {
        let cookie;

        if (await validateDevice()) {
            cookie = getCookie(name);
        } else {
            cookie = await getObject(name);
        }

        return cookie;

    } catch (error) {
        console.error("Error al leer cookie", error);
    }
}

export async function deleteCookieNext(name) {
    if (await validateDevice()) {
        deleteCookie(name);
    } else {
        deleteObject(name);
    }
}

export async function validateDevice() {
    const info = await Device.getInfo();
    return info.platform === "web" ? true : false;
};

// JSON "set" example
async function setObject(key, value) {
    try {
        await Preferences.set({
            key,
            value,
        });
    } catch (error) {
        console.error(error);
    }
}

// JSON "get" example
async function getObject(key) {
    const ret = await Preferences.get({ key });
    return ret.value;
}

async function deleteObject(key) {
    const ret = await Preferences.remove({ key });
}