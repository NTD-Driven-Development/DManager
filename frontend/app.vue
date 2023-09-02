<template>
	<div>
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
	watch(() => useRoute().path, (n) => {
		if (n.startsWith('/login') || n.startsWith('/summary')) {
			setPageLayout('');
		}
		else {
			setPageLayout('default');
		}
	}, { immediate: true, deep: true });
</script>