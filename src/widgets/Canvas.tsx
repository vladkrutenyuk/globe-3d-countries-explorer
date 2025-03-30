import { FC, HTMLAttributes, useEffect, useRef } from "react";
import { useAppCore } from "../features/app-core/AppCoreContext";

export const Canvas: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
	const appCore = useAppCore();
	const ref = useRef<HTMLDivElement>(null);

	const ctx = appCore.ctx;

	useEffect(() => {
		const html = ref.current;
		if (!html) return;

		ctx.three.mount(html);
		ctx.run();
		return () => {
			ctx.three.unmount();
			ctx.run();
		};
	}, [ctx]);

	return <div {...props} ref={ref}></div>;
};
