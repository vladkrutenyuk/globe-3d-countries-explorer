import { Button } from "@/shared/shadcn/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/shadcn/components/ui/sheet";
import { Loader2, SquareMenu } from "lucide-react";
import { FC, PropsWithChildren } from "react";
import { useCountryDataFetch } from "../rest-countries-data/useCountryDataFetch";
import { CountryDetailedInfoContent } from "./CountryDetailedInfoContent";
import { Drawer } from "vaul";
import { cn } from "@/shared/shadcn/lib/utils";

export const CountryContextBar: FC<{ countryId: string }> = ({ countryId }) => {
	const { data, loading, error } = useCountryDataFetch(countryId, ["name", "flag"]);

	if (error) return <BarContainer>{error}</BarContainer>;

	if (!data || loading) {
		return (
			<BarContainer>
				{/* <span className="text-[1.3em] pl-1.5 pr-2">{data.flag}</span> */}
				<div className="pl-1.5 flex items-center justify-center">
					<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
				</div>
				<span className="pl-1.5 flex-grow">{countryId}</span>
				<Button variant="secondary" disabled>
					<SquareMenu />
					Info
				</Button>
			</BarContainer>
		);
	}

	return (
		<BarContainer>
			<span className="text-[1.3em] pl-1.5 pr-2">{data.flag}</span>
			<strong className="flex-grow pr-4">{data.name.common}</strong>
			<div className="hidden md:block">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="secondary">
							<SquareMenu />
							Info
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<SheetHeader>
							<SheetTitle className="text-2xl">
								{data.name.common}
							</SheetTitle>
							<SheetDescription>{data.name.official}</SheetDescription>
							<div>
								<hr className="mt-2 mb-2" />
							</div>
							<CountryDetailedInfoContent countryId={countryId} />
						</SheetHeader>
					</SheetContent>
				</Sheet>
			</div>
			<div className="md:hidden">
				<Drawer.Root shouldScaleBackground>
					<Drawer.Trigger asChild>
						<Button variant="secondary">
							<SquareMenu />
							Info
						</Button>
					</Drawer.Trigger>
					<Drawer.Portal>
						<Drawer.Overlay className="fixed inset-0 bg-background/80" />
						<Drawer.Content
							className={cn(
								"fixed bottom-0 left-0 right-0 mt-24 rounded-t-[10px] bg-background border z-50"
							)}
						>
							<div className="mx-auto mt-4 h-1 w-[80px] rounded-full bg-foreground/50"></div>
							<div className="w-full h-full p-3">
								<Drawer.Title className="hidden">
									{data.name.common}
								</Drawer.Title>

								<div className="w-full p-3 flex space-x-6 mt-6">
									<CountryDetailedInfoContent
										className="w-full"
										countryId={countryId}
									/>
								</div>
							</div>
						</Drawer.Content>
					</Drawer.Portal>
				</Drawer.Root>
			</div>
		</BarContainer>
	);
};

const BarContainer: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="fixed top-4 right-4 flex items-center bg-background border border-input rounded-lg p-2 min-w-72">
			{children}
		</div>
	);
};
