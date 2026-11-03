import { WebSocketServer } from "ws";
/** Serves the collaboration socket on the host's own listener. */
export function mountCollab({ listener, collab, path }) {
    const sockets = new WebSocketServer({ noServer: true });
    listener.on("upgrade", (request, socket, head) => {
        if (pathOf(request) !== path) {
            return;
        }
        sockets.handleUpgrade(request, socket, head, (websocket) => serve(collab, websocket, request));
    });
}
function serve(collab, websocket, request) {
    const connection = collab.handleConnection(websocket, webRequest(request));
    websocket.on("message", (message) => connection.handleMessage(new Uint8Array(message)));
    websocket.on("close", (code, reason) => connection.handleClose(closeEvent(code, reason.toString())));
}
function pathOf(request) {
    return url(request).pathname;
}
function webRequest(request) {
    return new Request(url(request), { headers: headersOf(request) });
}
function url(request) {
    return new URL(request.url ?? "/", `http://${request.headers.host ?? "host"}`);
}
function headersOf(request) {
    const headers = new Headers();
    Object.entries(request.headers)
        .filter(([, value]) => typeof value === "string")
        .forEach(([name, value]) => headers.set(name, String(value)));
    return headers;
}
// Hocuspocus reads only code and reason; ws gives us those, not a DOM event.
function closeEvent(code, reason) {
    return { code, reason };
}
//# sourceMappingURL=upgrade.js.map