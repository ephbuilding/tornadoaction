import rewind from "@turf/rewind";
import { geoAlbers, geoPath } from "d3-geo";

import { USMap, USMapLoading } from "components";
import { useCategoricalOutlookByLayerId } from "services/outlook-mapserver";

const projection = geoAlbers();
const albersGeoPath = geoPath(projection);

export const CategoricalMap = ({ layerId, styles }) => {
	const DAY_LAYER_MAP = Object.freeze({
		1: 1,
		2: 9,
		3: 17,
	});
	const { data: outlookFeatures } = useCategoricalOutlookByLayerId(
		DAY_LAYER_MAP[layerId]
	);

	return (
		<section id='convective-outlook-map'>
			{outlookFeatures ? (
				<USMap>
					{outlookFeatures.map((feature) => {
						const {
							id,
							properties: { dn: categoryKey, idp_source },
						} = feature;

						return (
							<path
								key={`${idp_source}-${id}`}
								d={albersGeoPath(rewind(feature, { reverse: true }))}
								fill={styles[categoryKey].bgColor}
								opacity={0.7}
								stroke={styles[categoryKey].stroke}
								strokeWidth={4}
							/>
						);
					})}
				</USMap>
			) : (
				<USMapLoading loadingMessage='Outlook Loading...' />
			)}
			<CategoricalLegend styles={styles} />
		</section>
	);
};

const CategoricalLegend = ({ styles }) => {
	const stylesArr = Object.values(styles);

	return (
		<div className='text-xs flex justify-center mt-10 mb-16 sm:text-sm lg:text-lg'>
			<div className='grid gap-4 grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center pl-10'>
				{stylesArr.map(({ bgColor, textColor, label }) => {
					return (
						<div
							key={label}
							style={{ backgroundColor: `${bgColor}` }}
							className='p-2 rounded text-xs text-center'
						>
							<span
								style={{ color: `${textColor}` }}
								className='text-black font-bold uppercase'
							>
								{label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const LegendKey = ({ colorStr, labelStr }) => {
	return (
		<div className='flex items-center'>
			<div
				style={{ backgroundColor: `${colorStr}` }}
				className='h-2 w-2 rounded-sm sm:h-4 sm:w-4'
			/>
			<span className='ml-2'>{labelStr}</span>
		</div>
	);
};
