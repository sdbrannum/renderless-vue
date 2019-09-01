<template>
    <FuzzySearch :data="questions" :query="search">
        <template v-slot="{ results }">
            <div>
                <input v-model="search" />
                Results: {{ results.length }}
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <defs>
                            <filter id="goo">
                                <feGaussianBlur
                                    in="SourceGraphic"
                                    stdDeviation="10"
                                    result="blur"
                                />
                                <feColorMatrix
                                    in="blur"
                                    mode="matrix"
                                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -10"
                                    result="goo"
                                />
                                <feBlend
                                    in="SourceGraphic"
                                    in2="goo"
                                    operator="atop"
                                />
                            </filter>
                        </defs>
                    </svg>
                    <div class="loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </template>
    </FuzzySearch>
</template>

<script>
import FuzzySearch from './FuzzySearch.js';

export default {
    components: {
        FuzzySearch,
    },
    data() {
        return {
            questions: [],
            search: null,
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            try {
                const res = await fetch('/jeopardy.json');
                this.questions = await res.json();
            } catch (e) {
                console.error('error >', e);
            }
        },
    },
};
</script>

<style scoped>
svg {
    height: 0px;
    width: 0px;
}

@keyframes loader {
    50% {
        transform: translateY(-16px);
        background-color: #1b98e0;
    }
}
body {
    background-color: #13293d;
    margin: 0;
}

.loader {
    filter: url('#goo');
    width: 100px;
    margin: 0 auto;
    position: relative;
    top: 50vh;
    transform: translateY(-10px);
}
.loader > div {
    float: left;
    height: 20px;
    width: 20px;
    border-radius: 100%;
    background-color: #006494;
    animation: loader 0.8s infinite;
}

.loader > div:nth-child(1) {
    animation-delay: 0.16s;
}

.loader > div:nth-child(2) {
    animation-delay: 0.32s;
}

.loader > div:nth-child(3) {
    animation-delay: 0.48s;
}

.loader > div:nth-child(4) {
    animation-delay: 0.64s;
}

.loader > div:nth-child(5) {
    animation-delay: 0.8s;
}
</style>
