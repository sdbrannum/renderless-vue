<template>
    <div id="app">
        <FuzzySearchImpl />
    </div>
</template>

<script>
import FuzzySearchImpl from '@/components/FuzzySearch/FuzzySearchImpl.vue';

export default {
    name: 'app',
    components: {
        FuzzySearchImpl,
    },
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
