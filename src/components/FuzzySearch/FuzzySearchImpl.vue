<template>
    <div>
        <FuzzySearch
            :data="questions"
            :keys="questionKeys"
            :query="searchQuestions"
            key="1"
            :useWorker="true"
        >
            <template v-slot="{ results, totalResults }">
                <div>
                    <input v-model="searchQuestions" />
                    Results: {{ totalResults }}
                    <table>
                        <thead>
                            <th>Question</th>
                            <th>Answer</th>
                        </thead>
                        <tbody>
                            <template v-if="results.length > 0">
                                <tr v-for="(res, idx) in results" :key="idx">
                                    <td>{{ res.data.question }}</td>
                                    <td>{{ res.data.answer }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </template>
        </FuzzySearch>
        <FuzzySearch :data="todos" :query="searchTodos" key="2">
            <template v-slot="{ results, totalResults }">
                <div>
                    <input v-model="searchTodos" />
                    Results: {{ totalResults }}
                    <ul>
                        <li v-for="(res, idx) in results" :key="idx">
                            {{ res.data }}
                        </li>
                    </ul>
                </div>
            </template>
        </FuzzySearch>
    </div>
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
            questionKeys: [],
            searchQuestions: '',
            todos: [],
            searchTodos: '',
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            try {
                const resTodos = await fetch('/todos.json');
                this.todos = await resTodos.json();
                const resQuestions = await fetch('/jeopardy.json');
                this.questions = await resQuestions.json();
                this.questionKeys = ['question', 'answer'];
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
