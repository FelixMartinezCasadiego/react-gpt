export interface ProsConsResponse {
  index: number;
  message: Message;
  logprobs: null;
  finish_reason: string;
}

export interface Message {
  role: string;
  content: string;
  refusal: null;
  annotations: any[];
}
