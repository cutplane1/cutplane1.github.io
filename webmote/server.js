let screenSocket = null;

Deno.serve((req) => {
  const url = new URL(req.url);
  const isScreen = url.pathname === "/screen" || url.pathname === "/screen.html";

  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);

    if (isScreen) {
      socket.addEventListener("open", () => {
        screenSocket = socket;
        console.log("Screen connected");
      });
      socket.addEventListener("close", () => {
        screenSocket = null;
        console.log("Screen disconnected");
      });
    } else {
      socket.addEventListener("open", () => {
        console.log("Controller connected");
      });
      socket.addEventListener("message", (event) => {
        // console.log("From controller:", event.data);
        if (screenSocket?.readyState === WebSocket.OPEN) {
          screenSocket.send(event.data);
        }
      });
      socket.addEventListener("close", () => {
        console.log("Controller disconnected");
      });
    }

    return response;
  }

  try {
    const file = isScreen ? "./screen.html" : "./controller.html";
    const html = Deno.readTextFileSync(file);
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    return new Response("File not found", { status: 404 });
  }
});