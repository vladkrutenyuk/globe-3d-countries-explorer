import { cn } from "@/shared/shadcn/lib/utils";
import { LoaderSpinner } from "./LoaderSpinner";
import { FC, HTMLAttributes } from "react";

export const LoadingScreen: FC<HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div {...props} className={cn("w-full h-full flex items-center justify-center", className)}>
			<div className="p-4 flex space-x-2 items-center bg-muted rounded-md">
				<LoaderSpinner />
				<span className="text-muted-foreground">Loading...</span>
			</div>
		</div>
	);
};
