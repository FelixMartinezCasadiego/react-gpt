import { GptMessage, MyMessage } from "../../components";

export function OrthographyPage() {
  return (
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white bg-white/5 h-full p-4">
      <div className="flex flex-col h-full overflow-y-auto mb-4">
        <div className="grid grid-cols-12 gap-y-2">
          <div className="col-span-12">
            <GptMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correcciones" />
          </div>
          <div className="col-span-12">
            <MyMessage text="Hola Mundo" />
          </div>
        </div>
      </div>
    </div>
  );
}
