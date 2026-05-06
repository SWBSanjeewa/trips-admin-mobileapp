import React from "react";
import { ImageStyle } from "react-native";

import {
	AssetArticlesDarkIcon,
	AssetArticlesIcon,
	AssetAuthDarkIcon,
	AssetAuthIcon,
	AssetDashboardsDarkIcon,
	AssetDashboardsIcon,
	AssetEcommerceDarkIcon,
	AssetEcommerceIcon,
	AssetMessagingDarkIcon,
	AssetMessagingIcon,
	AssetSocialDarkIcon,
	AssetSocialIcon,
} from "../../components/icons";
import { ThemedIcon } from "../../components/themed-icon.component";
import { MenuItem } from "../../model/menu-item.model";

export interface LayoutData extends MenuItem {
	route: string;
}

export const data: LayoutData[] = [
	{
		title: "Auth",
		route: "LayoutAuth",
		icon: (style: ImageStyle) => {
			return React.createElement(ThemedIcon, {
				...style,
				light: AssetAuthIcon,
				dark: AssetAuthDarkIcon,
			});
		},
	},
	{
		title: "Social",
		route: "LayoutSocial",
		icon: (style: ImageStyle) => {
			return React.createElement(ThemedIcon, {
				...style,
				light: AssetSocialIcon,
				dark: AssetSocialDarkIcon,
			});
		},
	},
	{
		title: "Articles",
		route: "LayoutArticles",
		icon: (style: ImageStyle) => {
			return React.createElement(ThemedIcon, {
				...style,
				light: AssetArticlesIcon,
				dark: AssetArticlesDarkIcon,
			});
		},
	},
	{
		title: "Messaging",
		route: "LayoutMessaging",
		icon: (style: ImageStyle) => {
			return React.createElement(ThemedIcon, {
				...style,
				light: AssetMessagingIcon,
				dark: AssetMessagingDarkIcon,
			});
		},
	},
	{
		title: "Dashboards",
		route: "LayoutDashboards",
		icon: (style: ImageStyle) => {
			return React.createElement(ThemedIcon, {
				...style,
				light: AssetDashboardsIcon,
				dark: AssetDashboardsDarkIcon,
			});
		},
	},
	{
		title: "Ecommerce",
		route: "LayoutEcommerce",
		icon: (style: ImageStyle) => {
			return React.createElement(ThemedIcon, {
				...style,
				light: AssetEcommerceIcon,
				dark: AssetEcommerceDarkIcon,
			});
		},
	},
];
