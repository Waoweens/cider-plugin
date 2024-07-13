import { defineCustomElement } from './CustomElement/apiCustomElement';
import { PluginAPI } from './api/PluginAPI';
import MySettings from './components/MySettings.vue';
import { customElementName } from './utils';
import config from './plugin.config.ts';
import { useCiderAudio } from './api/CiderAudio.ts';

/**
 * Custom Elements that will be registered in the app
 */
export const CustomElements = {
	settings: defineCustomElement(MySettings, {
		shadowRoot: false,
	}),
};

export default {
	name: config.name,
	identifier: config.identifier,
	/**
	 * Defining our custom settings panel element
	 */
	SettingsElement: customElementName('settings'),
	/**
	 * Initial setup function that is executed when the plugin is loaded
	 */
	setup() {
		// Temp workaround
		// @ts-ignore
		window.__VUE_OPTIONS_API__ = true;
		for (const [key, value] of Object.entries(CustomElements)) {
			const _key = key as keyof typeof CustomElements;
			customElements.define(customElementName(_key), value);
		}
	},
} as PluginAPI;
