<template>
	<NuxtLayout :name="layout">
		<NuxtPage/>
	</NuxtLayout>
</template>

<script setup lang="ts">
	const toastNotifier = inject(ToastNotifierKey);
	const layout = ref('default');

	watch(() => useRoute().path, (n) => {
		if (n.startsWith('/login')) {
			layout.value = '';
		}
	}, { immediate: true, deep: true });
</script>