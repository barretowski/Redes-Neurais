<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-spacer>
        <v-icon icon="mdi-brain"></v-icon>
        Redes Neurais - Inteligência Artificial
      </v-spacer>

      <v-btn
        :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="onClick"
      >Alterar Tema</v-btn>
      <v-btn variant="text" icon="mdi-information-outline"></v-btn>
    </v-app-bar>

    <v-main>
      <Conteudo/>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'
  const theme = ref('dark')

  function onClick () {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
</script>
<script>
import Conteudo from './components/Conteudo.vue'
  export default {
    name: 'App',
    components: {
      Conteudo
    },

  }
</script>
