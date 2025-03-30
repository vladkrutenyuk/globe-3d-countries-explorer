import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../shadcn/lib/utils";

export const TopBar: FC<PropsWithChildren & HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => {
	return (
		<div
			{...props}
			className={cn(
				"p-1.5 py-1.5 min-w-72 min-h-12",
				"flex items-center bg-background border border-input rounded-lg",
                "select-none",
				className
			)}
		>
			{children}
		</div>
	);
};
