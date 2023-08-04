<template>
	<div>
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
	const layout = ref();

	watch(() => toRef(useRoute().path), (n) => {
		//
	}, { immediate: true, deep: true });
</script>