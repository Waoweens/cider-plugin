/**
 * Example for how you may want to setup your configuration.
 */

import { setupConfig } from "./api/Config";

export const cfg = setupConfig({
    endpoint: <string>'',
	websockets: <boolean>true
});

export function useConfig() {
    return cfg.value;
}