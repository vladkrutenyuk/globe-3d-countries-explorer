import { FC } from "react";
import { useCountryDataFetch } from "../features/rest-countries-data/useCountryDataFetch";

export const CountryInfoCard: FC<{ countryId: string }> = ({ countryId }) => {
	const { data, loading, error } = useCountryDataFetch(countryId);

    if(!data || loading) {
        return <div className="fixed top-10 right-10">loading...</div>
    }

    if(error) return <div className="fixed top-10 right-10 text-destructive">{error}</div>

    return <div className="fixed top-10 right-10 bg-background">{JSON.stringify(data)}</div>
};
