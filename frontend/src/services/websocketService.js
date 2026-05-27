import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect(onConnect) {
        if (this.client && this.client.connected) {
            if (onConnect) onConnect();
            return;
        }

        const token = localStorage.getItem('token');

        this.client = new Client({
            brokerURL: import.meta.env.VITE_WS_URL || 'ws://localhost:8081/ws',
            connectHeaders: {
                Authorization: token ? `Bearer ${token}` : '',
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            console.log('Connected to WebSocket');
            if (onConnect) onConnect();
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.activate();
    }

    subscribe(topic, callback) {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket is not connected');
            return null;
        }

        // If already subscribed, return the existing subscription id
        if (this.subscriptions.has(topic)) {
            return this.subscriptions.get(topic).id;
        }

        const subscription = this.client.subscribe(topic, (message) => {
            if (message.body) {
                callback(JSON.parse(message.body));
            }
        });

        this.subscriptions.set(topic, subscription);
        return subscription.id;
    }

    unsubscribe(topic) {
        if (this.subscriptions.has(topic)) {
            this.subscriptions.get(topic).unsubscribe();
            this.subscriptions.delete(topic);
        }
    }

    disconnect() {
        if (this.client) {
            this.subscriptions.forEach((sub) => sub.unsubscribe());
            this.subscriptions.clear();
            this.client.deactivate();
            this.client = null;
            console.log('Disconnected from WebSocket');
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
