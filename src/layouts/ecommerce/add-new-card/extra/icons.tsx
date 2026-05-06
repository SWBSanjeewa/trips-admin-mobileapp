import { Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { ImageStyle } from "react-native";

export const EyeIcon = (style: ImageStyle): IconElement => <Icon {...style} name="eye" />;

export const EyeOffIcon = (style: ImageStyle): IconElement => <Icon {...style} name="eye-off" />;
