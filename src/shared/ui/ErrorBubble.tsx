import { FC, HTMLAttributes } from "react";
import { cn } from "../shadcn/lib/utils";

export const ErrorBubble: FC<{ error: string } & HTMLAttributes<HTMLDivElement>> = ({
	error,
	className,
	...props
}) => {
	return (
		<div
			{...props}
			className={cn(
				"text-destructive border border-destructive rounded-md bg-destructive/15 font-bold p-1",
				className
			)}
		>
			<span>{error}</span>
		</div>
	);
};
