import {io} from 'socket.io-client';

export const initSocket = async () =>{
    const options = {
        'force new connection': true,
        reconnectionAttempts : Infinity,
        timeout: 10000,
        transports: ['websocket'],
    };
    const socket =  io("http://localhost:5000", options);
    socket.on("connect", () => {
        console.log("✅ Connected to Socket.io server, ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Connection failed:", err.message);
    });

    return socket;
};