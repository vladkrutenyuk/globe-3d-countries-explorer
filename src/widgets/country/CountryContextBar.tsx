import { Button } from "@/shared/shadcn/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/shadcn/components/ui/sheet";
import { cn } from "@/shared/shadcn/lib/utils";
import { ErrorBubble } from "@/shared/ui/ErrorBubble";
import { LoaderSpinner } from "@/shared/ui/LoaderSpinner";
import { SquareMenu } from "lucide-react";
import { FC } from "react";
import { Drawer } from "vaul";
import {
	RestCountryData,
	useCountryDataFetch,
} from "../../features/rest-countries-data/useCountryDataFetch";
import { CountryDetailedInfoContent } from "./CountryDetailedInfoContent";

export const CountryContextBar: FC<{ countryId: string }> = ({ countryId }) => {
	const { data, loading, error } = useCountryDataFetch(countryId, ["name", "flag"]);

	if (error) return <ErrorBubble error={error.message} className="w-full"/>;

	if (!data || loading) {
		return (
			<>
				<LoaderSpinner />
				<span className="pl-1.5 flex-grow text-muted-foreground">
					{countryId}
				</span>
				<CountryInfoButton data={data} countryId={countryId} />
			</>
		);
	}

	return (
		<>
			<span className="text-[1.3em] pl-1.5 pr-2">{data.flag}</span>
			<strong className="flex-grow pr-4">{data.name.common}</strong>
			<CountryInfoButton data={data} countryId={countryId} />
		</>
	);
};

function CountryInfoButton({
	data,
	countryId,
}: {
	data?: Pick<RestCountryData, "name" | "flag"> | null;
	countryId?: string;
}) {
	if (!data || !countryId)
		return (
			<Button variant="secondary" disabled>
				<SquareMenu />
				Info
			</Button>
		);

	return (
		<>
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
							<div className="w-full h-full max-h-[90vh] p-3 overflow-scroll">
								<div className="w-full p-3">
									<Drawer.Title className="text-2xl font-bold">
										{data.name.common}
									</Drawer.Title>
									<Drawer.Description
										className={cn(
											"text-base text-muted-foreground",
											data.name.official !== data.name.common &&
												"hidden"
										)}
									>
										{data.name.official}
									</Drawer.Description>
									<div>
										<hr className="mt-3 mb-2" />
									</div>
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
		</>
	);
}
