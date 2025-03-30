import { FC, HTMLAttributes, PropsWithChildren } from "react";
import {
	RestCountryDataFields,
	useCountryDataFetch,
} from "../../features/rest-countries-data/useCountryDataFetch";
import { Button } from "@/shared/shadcn/components/ui/button";
import { Skeleton } from "@/shared/shadcn/components/ui/skeleton";
import { ErrorBubble } from "@/shared/ui/ErrorBubble";

const fields: RestCountryDataFields[] = [
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
];

export const CountryDetailedInfoContent: FC<
	HTMLAttributes<HTMLDivElement> & { countryId: string }
> = ({ countryId, ...props }) => {
	const { data, loading, error } = useCountryDataFetch(countryId, fields);

	if (error) return <ErrorBubble error={error.message} className="mt-4" />;

	if (!data || loading)
		return (
			<div {...props}>
				<SkeletonContent />
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

			<hr className="mt-6 mb-6 w-full" />
			<Content>
				<div className="w-full flex space-x-2 mt-2 [&>*]:flex-shrink-0 [&>*]:flex-grow">
					<LinkBtn href={data.maps.googleMaps}>Google Maps</LinkBtn>
					<LinkBtn href={data.maps.openStreetMaps}>OpenStreetMap</LinkBtn>
				</div>
			</Content>
		</div>
	);
};

function SkeletonContent() {
	return (
		<>
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
		</>
	);
}

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

function LinkBtn(props: PropsWithChildren & { href: string }) {
	return (
		<a href={props.href} target="_blank">
			<Button className="w-full" variant="outline">
				{props.children}
			</Button>
		</a>
	);
}
