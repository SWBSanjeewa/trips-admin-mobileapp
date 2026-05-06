import { Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { ImageStyle } from "react-native";
import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';

export const CreditCardIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="credit-card" />
);

export const MoreVerticalIcon = (style: ImageStyle): IconElement => (
	<MDIcon name="more-vertical"/>
);
