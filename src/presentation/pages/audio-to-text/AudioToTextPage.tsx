import { useState } from "react";

/* Components */
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxFile,
} from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export function AudioToTextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const hanlderPost = async (text: string, audioFile: File) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const resp = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);

    if (!resp.ok) return;

    const gptMessage = `
    ## El texto es:
    ${resp.message}
    `;

    setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);
  };

  return (
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white/5 h-full p-4">
      <div className="flex flex-col h-full overflow-y-auto mb-4">
        <div className="grid grid-cols-12 gap-y-2">
          <div className="col-span-12">
            <GptMessage text="Hola, que audio quieres convertir a texto?" />
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

      <TextMessageBoxFile
        onSendMessage={hanlderPost}
        placeholder="Escribe aquí lo que deseas"
        disabledCorrection
        accept="audio/*"
      />
    </div>
  );
}
