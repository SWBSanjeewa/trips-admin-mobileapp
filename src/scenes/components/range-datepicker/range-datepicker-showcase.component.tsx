import {
	CalendarRange,
	RangeDatepicker,
	RangeDatepickerElement,
	RangeDatepickerProps,
} from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";

type RangeDatepickerShowcaseProps = Omit<RangeDatepickerProps, "onSelect">;

export const RangeDatepickerShowcase = (
	props: RangeDatepickerShowcaseProps,
): RangeDatepickerElement => {
	const [range, setRange] = React.useState<CalendarRange<Date>>({});

	return (
		<RangeDatepicker {...props} style={styles.rangeDatepicker} range={range} onSelect={setRange} />
	);
};

const styles = StyleSheet.create({
	rangeDatepicker: {
		width: 200,
	},
});
