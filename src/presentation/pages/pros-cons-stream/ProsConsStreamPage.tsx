import { useState } from "react";

/* Components */
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";

/* Use cases  */
import { prosConsStreamUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export function ProsConsStreamPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const hanlderPost = async (text: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const reader = await prosConsStreamUseCase(text);
    setIsLoading(false);

    if (!reader) return alert("No se pudo generar el reader");

    // Generar el último mensaje
    const decoder = new TextDecoder();
    let message = "";

    setMessages((messages) => [...messages, { text: message, isGpt: true }]);

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });

      message += decodedChunk;

      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = message;
        return newMessages;
      });
    }
  };

  return (
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white/5 h-full p-4">
      <div className="flex flex-col h-full overflow-y-auto mb-4">
        <div className="grid grid-cols-12 gap-y-2">
          <div className="col-span-12">
            <GptMessage text="Que deseas comparar hoy?" />
          </div>

          {messages.map((message, index) =>
            message.isGpt ? (
              <div className="col-span-12" key={index}>
                <GptMessage text={message.text} />
              </div>
            ) : (
              <div className="col-span-12" key={index}>
                <MyMessage key={index} text={message.text} />
              </div>
            )
          )}

          {isLoading && <TypingLoader className="fade-in" />}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={hanlderPost}
        placeholder="Escribe aquí lo que deseas"
        disabledCorrection={true}
      />
    </div>
  );
}
