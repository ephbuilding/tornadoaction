import axios from "axios";
import * as FAKE_ALERTS from "./_fake_data/tornadoAlerts";
// -- CONFIG
// -- CONSTANTS
// --
export const URLS = {
	webServiceBase: "https://api.weather.gov",
	stormWatches:
		"/alerts/active?event=Severe%20Thunderstorm%20Watch&message_type=alert",
	stormWarnings:
		"/alerts/active?event=Severe%20Thunderstorm%20Warning&message_type=alert",
	tornadoWatches: "/alerts/active?event=Tornado%20Watch&message_type=alert",
	tornadoWarnings: "/alerts/active?event=Tornado%20Warning&message_type=alert",
};
export const ALERT_TYPES = {
	stormWatch: "Severe Thunderstorm Warning",
	stormWarning: "Severe Thunderstorm Watch",
	tornadoWatch: "Tornado Watch",
	tornadoWarning: "Tornado Warning",
};
const DEFAULT_TIMEOUT = 5000;
export const CLIENT = axios.create({
	baseURL: URLS.webServiceBase,
	timeout: DEFAULT_TIMEOUT,
});
// -- SERVICE CALLS
export const getFakeNationalWeatherServiceAlerts = async (alertType) => {
	return FAKE_ALERTS[alertType.toUpperCase().split(" ").join("_")];
};
export const getNationalWeatherServiceAlerts = async (alertType) => {};
export const getTornadoAlerts = async (alertType) => {
	const endpoint =
		alertType === ALERT_TYPES.tornadoWarning
			? URLS.tornadoWarnings
			: URLS.tornadoWatches;

	const { data } = await CLIENT.get(endpoint);

	return await data.features;
};
export const getPublicInfoStatements = async () => {
	const end_date = new Date();
	const start_date = new Date(
		end_date.getFullYear(),
		end_date.getMonth(),
		end_date.getDate() - 14
	);
	const locationsSET = new Set();

	// ***************************************
	// 1. get tornado warnings from last 2 weeks
	// ***************************************
	const res = await getFromService(NATIONAL_WEATHER_SERVICE, "/alerts", {
		params: {
			start: start_date,
			end: end_date,
			message_type: "alert",
			event: "Tornado Warning",
		},
	});

	const warnings = await res.features;

	// ***************************************
	// 2. parse locations (station call signs) from WMOidentifiers
	// ***************************************
	const rawLocations = await warnings.map((warning) => {
		const wmoId = warning.properties.parameters.WMOidentifier[0];

		return parseLocation(wmoId);
	});

	// ***************************************
	// 3. create unique array of locations (station call signs)
	// to get PUBLIC INFORMATION STATEMENT ids for
	// ***************************************
	await rawLocations.forEach((location) => locationsSET.add(location));

	// ***************************************
	// 4. get PNS [id]s (Public Info Statements) for tornado-warned locations
	// ***************************************
	const pnsPromises = await Promise.all(
		Array.from(locationsSET).map((location) => {
			return getFromService(NATIONAL_WEATHER_SERVICE, "/products", {
				params: {
					start: start_date,
					end: end_date,
					type: "PNS",
					location: location,
				},
			});
		})
	);

	const pubInfoStatements = [];

	await pnsPromises.forEach((location) => {
		const locStatements = location["@graph"];

		if (locStatements.length > 0) {
			locStatements.forEach(({ id }) => pubInfoStatements.push(id));
		}
	});

	// ***************************************
	// 5. get PUBLIC INFO STATEMENTS for
	// tornado-warned locations over last
	// 2 weeks
	// ***************************************
	const tornadoWarnedPNSs = await Promise.all(
		pubInfoStatements.map((pnsId) => {
			return getFromService(NATIONAL_WEATHER_SERVICE, `/products/${pnsId}`);
		})
	);

	const regex = /preliminary damage assessment/i;

	return tornadoWarnedPNSs.filter(({ productText }) => {
		return regex.test(productText);
	});
};
// -- UTILS
export const parseLocation = (WMOidentifier) => {
	const splitWmoId = WMOidentifier.split(" ");
	const station = splitWmoId.slice(1, 2)[0];
	return station.slice(1);
};
