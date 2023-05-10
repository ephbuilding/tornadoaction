import React from "react";
import { Button, Form, Radio } from "react-daisyui";

import { PageLayout } from "components";
import { AlertPolygonMap, AlertStats } from "features/nws-alerts";
import { ConvectiveOutlookMap } from "features/spc-convective-outlooks/components";
import {
	useAllLayersAndTables,
	useLayerGeoJSONQuery,
	useLegendLayersQuery,
} from "services/arcgis-server-convective-outlooks/service";

const HomePage = () => {
	const alertStats = { warningCount: 0, watchCount: 0 };
	const { data: allLayersAndTables, error: allLayersAndTablesError } =
		useAllLayersAndTables();
	const { data: legendLayers, error: legendLayersError } =
		useLegendLayersQuery();

	const [selectedDay, setSelectedDay] = React.useState(0);
	const [selectedLayer, setSelectedLayer] = React.useState(0);

	const handleSelectedDay = (e) => {
		setSelectedDay(e.target.value);
		setSelectedLayer(e.target.value);
	};

	const handleLayerOnSelect = (e) => {
		setSelectedLayer(e.target.value);
	};

	if (allLayersAndTables)
		console.log(">> allLayersAndTables\n", allLayersAndTables);
	if (legendLayers) console.log(">> legendLayers\n", legendLayers);

	return (
		<PageLayout>
			{/* <AlertStats stats={alertStats} /> */}
			<AlertPolygonMap />
			<div>
				<OutlookDaySelector onChangeHandler={handleSelectedDay} />
				<h1 className='text-center'>Selected Layer: {selectedLayer}</h1>

				<div className='flex'>
					<ConvectiveOutlookMap />
					{allLayersAndTables && (
						<SubLayerSelector
							allLayers={allLayersAndTables}
							selectedDay={selectedDay}
							onSelectHandler={handleLayerOnSelect}
						/>
					)}
				</div>
			</div>
		</PageLayout>
	);
};

export default HomePage;

const OutlookDaySelector = ({ onChangeHandler }) => {
	return (
		<div className='flex items-center justify-center'>
			<span className='mr-10'>Convective Outlook Day:</span>
			<Form className='flex flex-row' onChange={onChangeHandler}>
				<OptionRadio title='1' value={0} defaultChecked />
				<OptionRadio title='2' value={8} />
				<OptionRadio title='3' value={16} />
			</Form>
		</div>
	);
};

const OptionRadio = ({ title, value, ...rest }) => {
	return (
		<Form.Label title={title}>
			<Radio
				name='outlookDays'
				value={value}
				className='ml-3'
				size='xs'
				{...rest}
			/>
		</Form.Label>
	);
};

const SubLayerSelector = ({ allLayers, selectedDay, onSelectHandler }) => {
	const subLayers = getSubLayerArr({ allLayers, selectedDay });

	return (
		<div className='flex flex-col justify-center'>
			{subLayers.map(({ id, name }) => {
				const dayRemoved = name.replace(/^.{6}/, "");
				const label = dayRemoved.toLowerCase().replace(" outlook", "");

				return (
					<Button key={name} className='mb-3 text-2xs'>
						{/* {name.replace(/^.{6}/, "")} */}
						{label}
					</Button>
				);
			})}
		</div>
	);
};

const getSubLayerArr = ({ allLayers, selectedDay }) => {
	const selectedLayer = allLayers.find(({ id }) => id == selectedDay);
	return selectedLayer.subLayers;
};
