import { FC, HTMLAttributes } from "react";
import { ThreeRendererMount } from "three-start/react";
import { useAppCore } from "../features/app-core/AppCoreContext";

export const Canvas: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
	const appCore = useAppCore();

	return <ThreeRendererMount {...props} ctx={appCore.starter} />;
};
