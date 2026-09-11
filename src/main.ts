import van from "vanjs-core";
import { AppCore } from "./core/AppCore";
import { LoadingScreen } from "./shared/ui/LoadingScreen";
import { PageError } from "./shared/ui/PageError";
import { OverlayLayout } from "./widgets/OverlayLayout";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/app.css";

const { div } = van.tags;

console.log("Developed by Vladislav Kruteniuk – Test Coding Challenge (c) 2025");

const app = document.getElementById("app")!;
const loading = LoadingScreen();
van.add(app, loading);

AppCore.loadAsync()
	.then((appCore) => {
		const canvas = div({ class: "canvas" });
		loading.replaceWith(canvas);
		van.add(app, OverlayLayout(appCore));
		// mount once the container is in the DOM: three-start sizes the canvas from it
		appCore.starter.mount(canvas);
	})
	.catch((err: Error) => {
		console.error(err);
		loading.replaceWith(PageError(err.message));
	});
