import { useState } from "react";
/*  Use cases */
import { prosConsUseCase } from "../../../core/use-cases";

/* Components */
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";

interface Message {
  text: string;
  isGpt: boolean;
}

export function ProsConstPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlerPost = async (text: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { ok, content } = await prosConsUseCase(text);

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "No se pudo realizar la comparación",
          isGpt: false,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: content ?? "",
          isGpt: true,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white/5 h-full p-4">
      <div className="flex flex-col h-full overflow-y-auto mb-4">
        <div className="grid grid-cols-12 gap-y-2">
          <div className="col-span-12">
            <GptMessage text="Hola, puedes escribir lo que sea que queires que compare y quieres que te de mis puntos de vista" />
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
        onSendMessage={handlerPost}
        placeholder="Escribe aquí lo que deseas"
        disabledCorrection={true}
      />
    </div>
  );
}
