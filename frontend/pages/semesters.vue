<template>
    <div>
        {{ semesters }}
    </div>
</template>

<script setup lang="ts">
    import { SemesterPaginator } from '~/composables/api/semester';

    const semesterPaginator = new SemesterPaginator();
    const { data: semesters } = semesterPaginator;
</script>