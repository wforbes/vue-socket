const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
	socket.broadcast.emit("chat message", "a user connected");

	socket.on("sign on", (username) => {
		socket.data.username = username;
	});

	socket.on("chat message", (msg) => {
		let fullMsg = `${socket.data.username} says: '${msg}'`;
		socket.broadcast.emit("chat message", fullMsg);
	});

	socket.on("typing", (isTyping) => {
		console.log("Typing", socket.data.username, isTyping);
		socket.broadcast.emit("otherIsTyping", {
			isTyping,
			username: socket.data.username
		});
	});

	socket.on("disconnect", () => {
		socket.broadcast.emit("chat message", "user disconnected");
	});
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});
