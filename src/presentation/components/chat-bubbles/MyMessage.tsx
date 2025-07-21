interface Props {
  text: string;
}

export function MyMessage({ text }: Props) {
  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          F
        </div>
        <div className="relative mr-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
          {text}
        </div>
      </div>
    </div>
  );
}
