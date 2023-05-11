import React from "react";
import { Button, Form, Radio } from "react-daisyui";

import { PageLayout } from "components";
import { Dashboard } from "components/Dashboard/Dashboard";

const HomePage = () => {
	return (
		<PageLayout>
			<Dashboard />
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
				// className='ml-3'
				size='xs'
				{...rest}
			/>
		</Form.Label>
	);
};

const SubLayerSelector = ({ allLayers, selectedDay, onClickHandler }) => {
	const subLayers = getSubLayerArr({ allLayers, selectedDay });

	return (
		<div className='flex flex-col justify-center'>
			{subLayers.map(({ id, name }) => {
				const label = createSubLayerSelectBtnLabelText(name);

				return (
					<Button
						key={name}
						className='mb-3 text-2xs'
						onClick={() => onClickHandler(id)}
					>
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

const createSubLayerSelectBtnLabelText = (name) => {
	const dayRemoved = name.replace(/^.{6}/, "");
	const label = dayRemoved.toLowerCase().replace(" outlook", "");
	return label;
};
