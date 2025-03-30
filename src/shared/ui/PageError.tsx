import { cn } from "@/shared/shadcn/lib/utils";
import { FC, HTMLAttributes } from "react";
import { ErrorBubble } from "./ErrorBubble";

export const PageError: FC<HTMLAttributes<HTMLDivElement> & {error: string}> = ({
    className,
    error,
    ...props
}) => {
    return (
        <div {...props} className={cn("w-full h-full flex items-center justify-center", className)}>
            <div className="p-4 flex space-x-2 items-center bg-muted rounded-md">
                <ErrorBubble error={error}/>
            </div>
        </div>
    );
};
