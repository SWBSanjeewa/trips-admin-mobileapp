import { Input, InputElement, InputProps } from "@ui-kitten/components";
import React from "react";

export const InputShowcase = (props?: InputProps): InputElement => {
	const [value, setValue] = React.useState<string>(null);

	return <Input {...props} value={value} onChangeText={setValue} placeholder="Place your Text" />;
};
