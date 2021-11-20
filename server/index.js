const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:8080",
		methods: ["GET", "POST"],
		credentials: true
	}
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
	socket.broadcast.emit("chatMessage", {
		user: "system",
		prefix: "SYSTEM msg:",
		content: "(New connection)"
	});

	socket.on("signOn", (username) => {
		socket.data.username = username;
		socket.broadcast.emit("chatMessage", {
			user: "system",
			prefix: "SYSTEM msg:",
			content: username + " has connected!"
		});
	});

	socket.on("disconnect", () => {
		socket.broadcast.emit("chatMessage", {
			user: "system",
			prefix: "SYSTEM msg:",
			content: socket.data.username + " has disconnected!"
		});
	});

	socket.on("chatMessage", (msg) => {
		//let fullMsg = `${socket.data.username} says: '${msg}'`;
		socket.broadcast.emit("chatMessage", {
			user: socket.data.username,
			prefix: `${socket.data.username} says:`,
			content: msg
		});
	});

	socket.on("typing", (isTyping) => {
		console.log("Typing", socket.data.username, isTyping);
		socket.broadcast.emit("otherIsTyping", {
			isTyping,
			username: socket.data.username
		});
	});
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});
