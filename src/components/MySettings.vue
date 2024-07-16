<script setup lang="ts">
import { useConfig } from '../config';

const cfg = useConfig();
</script>

<template>
	<div class="q-px-lg plugin-base">
		<div class="container">
			<span>Configure plugin</span>
			<div>
				<label>
					Server endpoint URL
					<input type="text" v-model="cfg.endpoint" />
				</label>
			</div>
			<div>
				<label>
					<input
						type="radio"
						disabled
						v-model="cfg.websockets"
						v-bind:value="true"
					/>
					WebSockets
				</label>
				<label>
					<input
						type="radio"
						disabled
						v-model="cfg.websockets"
						v-bind:value="false"
					/>
					Polling
				</label>
			</div>
			<div>
				<button type="button" class="c-btn primary">Refresh</button>
			</div>
		</div>
		<div class="container">
			<span>Status</span>
		</div>
	</div>
</template>

<style scoped>
.container {
	margin-bottom: 2rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
</style>
