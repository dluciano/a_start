import "./styles.css";

import P5 from "p5";
import { Sketch } from "./Sketch";

const appElement = document.getElementById("app");
if (!appElement) throw new Error("app element is not defined");
new P5(Sketch, appElement);
