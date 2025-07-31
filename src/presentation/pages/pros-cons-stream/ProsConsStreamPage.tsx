import { useState } from "react";

/* Components */
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";

/* Use cases  */
import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases";

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

    const stream = await prosConsStreamGeneratorUseCase(text);
    setIsLoading(false);

    setMessages((messages) => [...messages, { text: "", isGpt: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = text;
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
