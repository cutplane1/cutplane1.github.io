let screenSocket = null;
let controllerSocket = null;

Deno.serve((req) => {
  const url = new URL(req.url);
  const isScreen = url.pathname === "/screen" || url.pathname === "/screen.html";

  if (req.headers.get("upgrade") !== "websocket") {
    try {
      const file = isScreen ? "./screen.html" : "./controller.html";
      const html = Deno.readTextFileSync(file);
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    } catch {
      return new Response("File not found", { status: 404 });
    }
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  if (isScreen) {
    socket.addEventListener("open", () => {
      screenSocket = socket;
    });
    socket.addEventListener("close", () => {
      screenSocket = null;
    });
  } else {
    socket.addEventListener("open", () => {
      controllerSocket = socket;
      console.log("controller connected");
    });
    socket.addEventListener("close", () => {
      controllerSocket = null;
    });
    socket.addEventListener("message", (event) => {
      if (screenSocket?.readyState === WebSocket.OPEN) {
        console.log(event);
        screenSocket.send(event.data);
      }
    });
  }

  return response;
});