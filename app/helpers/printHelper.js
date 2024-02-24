import { BleClient } from '@capacitor-community/bluetooth-le';

let device;
let characteristic;

const conectarDispositivo = async () => {
  try {
    await BleClient.initialize();

    const device = await BleClient.requestDevice({
      services: ["000018f0-0000-1000-8000-00805f9b34fb"],
    });

    // connect to device, the onDisconnect callback is optional
    await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
    console.log('connected to device', device);

    return device.deviceId

  } catch (error) {
    console.error("Error al imprimir por Bluetooth:", error);
  }
}

const printIos = async (printer, printData) => {
  const data = convertirHTMLaTextoConEstilos(printData)
  const text = new TextEncoder("utf-8").encode(data + "\u000A\u000D");

  await BleClient.write(printer, "000018f0-0000-1000-8000-00805f9b34fb", "00002af1-0000-1000-8000-00805f9b34fb", text);
}

const conectar = async () => {
  try {
    console.log("CONECTANDO");
    // Solicitar permiso para acceder al dispositivo Bluetooth
    device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: ["000018f0-0000-1000-8000-00805f9b34fb"],
        },
      ],
    });

    // Conectar al dispositivo seleccionado
    const server = await device.gatt.connect();

    return server;
  } catch (error) {
    console.error("Error al imprimir por Bluetooth:", error);
    alert("Error al imprimir por Bluetooth: " + error);
  }
};

const printText = async (server, printData) => {
  console.log({ server });
  // Obtener el servicio de impresión
  const service = await server.getPrimaryService(
    "000018f0-0000-1000-8000-00805f9b34fb"
  );

  // Enviar datos de impresión
  characteristic = await service.getCharacteristic(
    "00002af1-0000-1000-8000-00805f9b34fb"
  );

  const data = printData
    ? convertirHTMLaTextoConEstilos(printData)
    : `
  Remitente
  Nadiuska Quintero
  CC. 100184534

  Destinatario
  Pepe Perez
  CC 112341


`;

  console.log({ data });

  const text = new TextEncoder("utf-8").encode(data + "\u000A\u000D");
  await characteristic.writeValue(text);
};

export function convertirHTMLaTextoConEstilos(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  let textoConEstilos = "";

  console.log(html);

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      switch (tagName) {
        case "h1":
          console.log("PASE POR h1", node.textContent.trim());
          textoConEstilos += "\x1B\x21\x30" + node.textContent.trim() + "\n";
          break;
        case "h2":
          textoConEstilos += "\x1B\x21\x20" + node.textContent.trim() + "\n";
          break;
        case "h3":
          textoConEstilos += "\x1B\x21\x10" + node.textContent.trim() + "\n";
          break;
        case "h4":
          textoConEstilos += "\x1B\x21\x08" + node.textContent.trim() + "\n";
          break;
        case "h5":
        case "h6":
        case "strong":
          console.log("PASE POR BOLD", node.textContent.trim());
          textoConEstilos +=
            "\x1B\x45\x01" + node.textContent.trim() + "\x1B\x45\x00";
          break;
        case "b":
          textoConEstilos +=
            "\x1B\x45\x01" + node.textContent.trim() + "\x1B\x45\x00";
          break;
        case "br":
          textoConEstilos += "\n";
          break;
        case "p":
          console.log("PASE POR p", node.textContent);
          textoConEstilos += "\x1B\x21\x01" + node.textContent.trim() + "\n";
          break;
        default:
          textoConEstilos += "\x1B\x21\x01" + node.textContent.trim() + "\n\n";
          break;
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      textoConEstilos += node.textContent;
    }
  });
  console.log(textoConEstilos);
  return textoConEstilos;
}

module.exports = { conectar, printText, conectarDispositivo, printIos };
