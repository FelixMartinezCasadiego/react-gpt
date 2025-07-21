import { RouterProvider } from "react-router-dom";

/* Presentation - router */
import { router } from "./presentation/router/router";

export function ReactGPT() {
  return <RouterProvider router={router} />;
}
