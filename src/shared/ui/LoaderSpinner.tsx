import { Loader2 } from "lucide-react";
import { FC } from "react";

export const LoaderSpinner: FC = () => {
	return (
		<div className="pl-1.5 flex items-center justify-center">
			<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
		</div>
	);
};
