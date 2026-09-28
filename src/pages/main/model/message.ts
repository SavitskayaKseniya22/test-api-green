export interface ChatMessage {
    id: string;
    text: string;
    timestamp: number;
    direction: "outgoing" | "incoming";
}
