import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MCQWrapper } from "./components/MCQWrapper";

const CONTAINER_ID = "study-buddy-mcq-root";

function mountMCQWrapper() {
  if (document.getElementById(CONTAINER_ID)) return;

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <MCQWrapper />
    </StrictMode>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountMCQWrapper, {
    once: true,
  });
} else {
  mountMCQWrapper();
}
