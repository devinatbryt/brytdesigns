import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";
import { FormSync } from "./components/index.js";

customShadowlessElement(
  FormSync.Name,
  {
    name: "",
    formId: "",
  },
  correctElementType(FormSync.Component),
);
