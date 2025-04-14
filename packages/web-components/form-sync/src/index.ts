import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { FormSync } from "./components/index.js";

customShadowlessElement(
  "form-sync",
  {
    name: "",
    formId: "",
  },
  correctElementType(FormSync)
);
