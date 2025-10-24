import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import Popup from "./components/Popup";
import { MCQWrapper } from "./components/MCQWrapper";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Popup /> */}
    <MCQWrapper />
  </StrictMode>
);
