import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.thermal.print.web.app',
    appName: 'thermal-print-web-app"',
    webDir: 'out',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        BluetoothLe: {
            displayStrings: {
                scanning: "Buscando",
                cancel: "Cancelar",
                availableDevices: "Dispositivos Disponibles",
                noDeviceFound: "No hay dispositivos"
            }
        }
    }
};

export default config;