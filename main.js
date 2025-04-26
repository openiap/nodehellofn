const { Client } = require("openiap");
const fs = require("fs");

const client = new Client();

// Default workitem queue
const defaultwiq = "hello";

async function onConnected() {
    try {
        let wiq = process.env.wiq || defaultwiq;
        let queue = process.env.queue || wiq;
        const queuename = client.register_queue({ queuename: queue }, async (event) => {
            let payload = event.data || {};
            payload.message = "hello";
            payload.dt = new Date();
            return payload
        });
        client.info(`Consuming queue: ${queuename}`);
    } catch (error) {
        client.error(error.message || error);
    }
}

async function main() {
    try {
        await client.connect();
        client.on_client_event(event => {
            if (event && event.event === "SignedIn") {
                onConnected().catch(client.error);
            }
        });
    } catch (error) {
        client.error(error.message || error);
    }
}

main();