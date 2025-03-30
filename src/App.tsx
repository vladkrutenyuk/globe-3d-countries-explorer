import { AppCoreProvider } from "./features/app-core/AppCoreProvider";
import { LoadingScreen } from "./shared/ui/LoadingScreen";
import { PageError } from "./shared/ui/PageError";
import { Canvas } from "./widgets/Canvas";
import { OverlayLayout } from "./widgets/OverlayLayout";

function App() {
	return (
		<main
			data-vaul-drawer-wrapper
			className="w-screen h-screen h-[100svh] overflow-hidden relative"
		>
			<AppCoreProvider
				loading={<LoadingScreen className="absolute top-0 left-0" />}
				errorFallback={(err) => <PageError error={err.message} />}
			>
				<Canvas className="w-full h-full absolute bottom-0 left-0" />
				<OverlayLayout />
			</AppCoreProvider>
		</main>
	);
}

export default App;
