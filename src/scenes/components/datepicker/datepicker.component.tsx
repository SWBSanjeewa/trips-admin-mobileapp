import { DatepickerElement, DatepickerProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { DatepickerShowcase } from "./datepicker-showcase.component";
import { datepickerShowcase } from "./type";

export const DatepickerScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: DatepickerProps): DatepickerElement => (
		<DatepickerShowcase {...props} />
	);

	return (
		<ShowcaseContainer
			showcase={datepickerShowcase}
			renderItem={renderItem}
			onBackPress={navigation.goBack}
		/>
	);
};
