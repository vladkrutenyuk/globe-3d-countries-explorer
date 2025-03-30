import { RestCountryData } from "@/features/rest-countries-data/useCountryDataFetch";
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
import { SquareMenu } from "lucide-react";
import { FC } from "react";
import { Drawer } from "vaul";
import { CountryDetailedInfoContent } from "./CountryDetailedInfoContent";

export const CountryInfoButton: FC<{
	data?: Pick<RestCountryData, "name" | "flag"> | null;
	countryId?: string;
}> = ({ data, countryId }) => {
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
								"fixed bottom-0 left-0 right-0 rounded-t-[10px] bg-background border z-50"
							)}
						>
							<div className="mx-auto mt-4 mb-6 h-1 w-[80px] rounded-full bg-foreground/50"></div>
							<div className="w-full h-[75vh] p-3 overflow-scroll">
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
};
