<template>
	<div>
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
	watch(() => useRoute().path, (n) => {
		if (n.startsWith('/login')) {
			setPageLayout('');
		}
		else {
			setPageLayout('default');
		}
	}, { immediate: true, deep: true });
</script>