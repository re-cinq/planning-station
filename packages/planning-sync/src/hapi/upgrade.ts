import type { IncomingMessage, Server as HttpServer } from "node:http";
import type { Hocuspocus } from "@hocuspocus/server";
import { WebSocketServer, type WebSocket } from "ws";

export interface CollabMount {
  listener: HttpServer;
  collab: Hocuspocus;
  path: string;
}

/** Serves the collaboration socket on the host's own listener. */
export function mountCollab({ listener, collab, path }: CollabMount): void {
  const sockets = new WebSocketServer({ noServer: true });

  listener.on("upgrade", (request, socket, head) => {
    if (pathOf(request) !== path) {
      return;
    }

    sockets.handleUpgrade(request, socket, head, (websocket) =>
      serve(collab, websocket, request),
    );
  });
}

function serve(
  collab: Hocuspocus,
  websocket: WebSocket,
  request: IncomingMessage,
): void {
  const connection = collab.handleConnection(websocket, webRequest(request));
  websocket.on("message", (message: Buffer) =>
    connection.handleMessage(new Uint8Array(message)),
  );
  websocket.on("close", (code: number, reason: Buffer) =>
    connection.handleClose(closeEvent(code, reason.toString())),
  );
}

function pathOf(request: IncomingMessage): string {
  return url(request).pathname;
}

function webRequest(request: IncomingMessage): Request {
  return new Request(url(request), { headers: headersOf(request) });
}

function url(request: IncomingMessage): URL {
  return new URL(
    request.url ?? "/",
    `http://${request.headers.host ?? "host"}`,
  );
}

function headersOf(request: IncomingMessage): Headers {
  const headers = new Headers();
  Object.entries(request.headers)
    .filter(([, value]) => typeof value === "string")
    .forEach(([name, value]) => headers.set(name, String(value)));

  return headers;
}

// Hocuspocus reads only code and reason; ws gives us those, not a DOM event.
function closeEvent(code: number, reason: string): CloseEvent {
  return { code, reason } as CloseEvent;
}
