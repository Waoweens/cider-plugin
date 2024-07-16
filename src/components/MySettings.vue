<script setup lang="ts">
import { useConfig } from '../config';

const cfg = useConfig();
</script>

<template>
	<div class="q-px-lg plugin-base">
		Configure plugin
		<div>
			<label>
				Server endpoint URL
				<input type="text" v-model="cfg.endpoint" />
			</label>
			<label>
				<input type="radio" />
				Polling
			</label>
			<label>
				<input type="radio" />
				WebSockets
			</label>
		</div>
	</div>
</template>

<style scoped></style>
