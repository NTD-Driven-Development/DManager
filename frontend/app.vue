<template>
	<NuxtLayout :name="layout">
		<NuxtPage/>
	</NuxtLayout>
</template>

<script setup lang="ts">
	const layout = ref('default');

	watch(() => useRoute().path, (n) => {
		if (n.startsWith('/login')) {
			layout.value = '';
		}
		else {
			layout.value = 'default';
		}
	}, { immediate: true, deep: true });
</script>