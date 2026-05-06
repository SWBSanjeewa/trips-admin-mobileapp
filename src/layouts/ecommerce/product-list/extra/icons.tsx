import { Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { ImageStyle } from "react-native";

export const CartIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="shopping-cart" />
);
