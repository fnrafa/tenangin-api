import {Server, Socket} from "socket.io";
import {Server as HTTPServer} from "http";

class WebSocket {
    private static io: Server | undefined;

    static boot(server: HTTPServer): void {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('A user connected with socket id:', socket.id);

            socket.on('disconnect', () => {
                console.log('User disconnected', socket.id);
            });
        });
    }
}

export default WebSocket;
