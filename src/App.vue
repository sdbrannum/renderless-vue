<template>
    <div id="app">
        <FuzzyTest />
    </div>
</template>

<script>
import FuzzyTest from '@/components/FuzzySearch/FuzzySearch.test.vue';

export default {
    name: 'app',
    components: {
        FuzzyTest,
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
