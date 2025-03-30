import { ErrorBubble } from "@/shared/ui/ErrorBubble";
import { LoaderSpinner } from "@/shared/ui/LoaderSpinner";
import { FC } from "react";
import {
	useCountryDataFetch
} from "../../features/rest-countries-data/useCountryDataFetch";
import { CountryInfoButton } from "./CountryInfoButton";

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