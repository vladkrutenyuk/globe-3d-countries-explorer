import { AppCoreProvider } from "./features/app-core/AppCoreProvider";
import { LoadingScreen } from "./shared/ui/LoadingScreen";
import { Canvas } from "./widgets/Canvas";
import { OverlayLayout } from "./widgets/OverlayLayout";

function App() {
	return (
		<main
			data-vaul-drawer-wrapper
			className="w-screen h-screen overflow-hidden relative"
		>
			<AppCoreProvider loading={<LoadingScreen className="absolute top-0 left-0" />}>
				<Canvas className="w-full h-full absolute top-0 left-0" />
				<OverlayLayout />
			</AppCoreProvider>
		</main>
	);
}

export default App;
