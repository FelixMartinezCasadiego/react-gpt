import { useState } from "react";

/* Components */
import {
  GptMessage,
  // GptMessageImage,
  GptMessageImageSelectableImage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";

/* Use Cases */
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: { imageUrl: string; alt: string };
}

export function ImageTunningPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: "Imagen base",
      info: {
        alt: "iamgen base",
        imageUrl:
          "http://localhost:3000/gpt/image-generation/1755024078597.png",
      },
    },
  ]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    if (!originalImageAndMask?.original) return;

    setIsLoading(true);
    const resp = await imageVariationUseCase(originalImageAndMask?.original);
    setIsLoading(false);

    if (!resp) return;
    setMessages((prev) => [
      ...prev,
      {
        text: "Variación",
        isGpt: true,
        info: { imageUrl: resp.url, alt: resp.alt },
      },
    ]);
  };

  const hanlderPost = async (text: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { mask, original } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask);

    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se pudo generar la iamgen", isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: { imageUrl: imageInfo.url, alt: imageInfo.alt },
      },
    ]);
  };

  return (
    <>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>

          <img
            className="border rounded-xl w-36 h-36 object-contain"
            src={
              originalImageAndMask.mask
                ? originalImageAndMask.mask
                : originalImageAndMask.original
            }
            alt="Imagen original"
          />

          <button className="btn-primary mt-2" onClick={handleVariation}>
            Generar Variación
          </button>
        </div>
      )}

      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white/5 h-full p-4">
        <div className="flex flex-col h-full overflow-y-auto mb-4">
          <div className="grid grid-cols-12 gap-y-2">
            <div className="col-span-12">
              <GptMessage text="Que imagen deseas generar hoy?" />
            </div>

            {messages.map((message, index) =>
              message.isGpt ? (
                <div className="col-span-12" key={index}>
                  {/* <GptMessageImage */}
                  <GptMessageImageSelectableImage
                    imageUrl={message.info?.imageUrl!}
                    alt={message.info?.alt!}
                    onImageSelected={(maskImageUrl) =>
                      setOriginalImageAndMask({
                        // original: maskImageUrl,
                        original: message.info?.imageUrl!,
                        mask: maskImageUrl,
                      })
                    }
                  />
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
    </>
  );
}
