<template>
	<div>
		<NuxtLayout name="">
			<NuxtPage/>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
	const layout = ref();

	watch(() => toRef(useRoute(), 'params'), (n) => {
		console.log(n);
		
	}, { immediate: true });
</script>