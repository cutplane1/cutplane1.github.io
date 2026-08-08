Deno.serve((req) => {

  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    console.log("a client connected!");
  });

  socket.addEventListener("message", (event) => {
    console.log("Received message:", event.data);
  });

  return response;
});

