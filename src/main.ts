import van from "vanjs-core";
import { World } from "./core/World";
import { $world } from "./stores";
import { OverlayLayout } from "./ui-components/OverlayLayout";
import { WorldCanvas } from "./ui-components/WorldCanvas";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/app.css";

console.log("Developed by Vladislav Kruteniuk – Test Coding Challenge (c) 2025");

van.add(document.getElementById("app")!, WorldCanvas(), OverlayLayout());
$world.set(new World());
