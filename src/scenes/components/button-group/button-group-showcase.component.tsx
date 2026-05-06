import { Button, ButtonGroup, ButtonGroupElement, ButtonGroupProps } from "@ui-kitten/components";
import React from "react";

export const ButtonGroupShowcase = (props?: ButtonGroupProps): ButtonGroupElement => (
	<ButtonGroup {...props}>
		<Button>L</Button>
		<Button>M</Button>
		<Button>R</Button>
	</ButtonGroup>
);
