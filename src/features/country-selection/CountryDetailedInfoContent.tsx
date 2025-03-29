import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { useCountryDataFetch } from "../rest-countries-data/useCountryDataFetch";
import { Button } from "@/shared/shadcn/components/ui/button";
import { Skeleton } from "@/shared/shadcn/components/ui/skeleton";

export const CountryDetailedInfoContent: FC<
	HTMLAttributes<HTMLDivElement> & { countryId: string }
> = ({ countryId, ...props }) => {
	const { data, loading, error } = useCountryDataFetch(countryId, [
		"name",
		"population",
		"area",
		"capital",
		"capitalInfo",
		"region",
		"maps",
		"subregion",
		"flag",
		"flags",
		"tld",
		"currencies",
	]);

	if (error)
		return (
			<div className="text-destructive">
				<div className="border border-destructive rounded-md mt-4 bg-destructive/15 font-bold px-2 py-1.5">
					<span>{error}</span>
				</div>
			</div>
		);

	if (!data || loading)
		return (
			<div {...props}>
				<Label>Flag</Label>
				<Content>
					<Skeleton className="h-[66px] w-[100px]" />
				</Content>

				<Label>Capital</Label>
				<Content>
					<Skeleton className="h-5 w-[200px]" />
				</Content>

				<Label>Aria</Label>
				<Content>
					<Skeleton className="h-5 w-[200px]" />
				</Content>

				<Label>Population</Label>
				<Content>
					<Skeleton className="h-5 w-[200px]" />
				</Content>

				<Label>Region</Label>
				<Content>
					<Skeleton className="h-5 w-[200px]" />
				</Content>

				<Label>Subregion</Label>
				<Content>
					<Skeleton className="h-5 w-[200px]" />
				</Content>

				<Label>Domain zones</Label>
				<Content>
					<Skeleton className="h-5 w-[200px]" />
				</Content>

				<Label>Currencies</Label>
				<Content>
					<Skeleton className="h-5 w-[200px]" />
				</Content>
			</div>
		);

	return (
		<div {...props}>
			<Label>Flag</Label>
			<Content>
				<img width={100} src={data.flags.png} alt={data.flags.alt}></img>
			</Content>

			<Label>Capital</Label>
			<Content>
				<span className="mr-1">{data.capital[0]}</span>{" "}
				<Code>{data.capitalInfo.latlng.join(", ")}</Code>
			</Content>

			<Label>Aria</Label>
			<Content>{data.area} км2</Content>

			<Label>Population</Label>
			<Content>{data.population}</Content>

			<Label>Region</Label>
			<Content>{data.region}</Content>

			<Label>Subregion</Label>
			<Content>{data.subregion}</Content>

			<Label>Domain zones</Label>
			<Content>
				<div className="space-x-3">
					{data.tld.map((x) => (
						<Code key={x}>{x}</Code>
					))}
				</div>
			</Content>

			<Label>Currencies</Label>
			<Content>
				<div className="space-x-3">
					{Object.entries(data.currencies).map(([key, value]) => (
						<div key={key}>
							{key}, {value.name}, {value.symbol}
						</div>
					))}
				</div>
			</Content>

			<hr className="mt-6 mb-6" />
			<Content>
				<div className="flex space-x-2 mt-2">
					<a href={data.maps.googleMaps} target="_blank">
						<Button variant="outline">Google Maps</Button>
					</a>
					<a href={data.maps.openStreetMaps} target="_blank">
						<Button variant="outline">OpenStreetMap</Button>
					</a>
				</div>
			</Content>
		</div>
	);
};

function Label(props: PropsWithChildren) {
	return <h3 className="font-semibold mt-4 mb-1">{props.children}</h3>;
}

function Content(props: PropsWithChildren) {
	return <div className="text-muted-foreground text-sm mt-2">{props.children}</div>;
}

function Code(props: PropsWithChildren) {
	return (
		<code className="text-[0.84em] bg-muted rounded px-1 py-0.5">
			{props.children}
		</code>
	);
}
