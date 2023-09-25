<template>
	<div>
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
	watch(() => useRoute().path, (n) => {
		if (n.startsWith('/login') || n.startsWith('/forget') || n.startsWith('/summary')) {
			setPageLayout(false);
		}
		else {
			setPageLayout('default');
		}
	}, { immediate: true, deep: true });
</script>