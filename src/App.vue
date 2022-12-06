<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-spacer>
        <v-icon icon="mdi-brain"></v-icon>
        Redes Neurais - Inteligência Artificial
      </v-spacer>

      <!-- <v-btn
        :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="onClick"
      >Alterar Tema</v-btn> -->
      <div class="text-center">
        <v-dialog v-model="dialogGuide">
          <template v-slot:activator="{ props }">
            <v-btn variant="text" title="Passo-a-passo" v-bind="props" icon="mdi-book-open-variant"></v-btn>
          </template>

          <v-card theme="dark" flat rounded="0">
            <v-window v-model="onboarding">
              <v-window-item v-for="n in length" :key="`card-${n}`" :value="n">
                <v-card  height="300" v-if="(n==1)">
                  <v-card-item class="d-flex justify-center align-center">
                    <p style="color:green; font-size:50px;"> <b>Passo 1: Preenchimento dos campos</b></p>
                  </v-card-item>
                  <v-card-item class="d-flex justify-left align-center">
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Preencha todos os campos de configurações, de neurônios e teste.</h3>
                  </v-card-item>
                </v-card>
                <v-card  height="300" v-if="(n==2)">
                  <v-card-item class="d-flex justify-center align-center">
                    <p style="color:green; font-size:50px;"> <b>Passo 2: Upload do arquivo de treino</b></p>
                  </v-card-item>
                  <v-card-item class="d-flex justify-left align-center">
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Insira o arquivo de treino no seu campo</h3>
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Após anexado, clique no botão "Carregar arquivo de treino"</h3>
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Aguarde o processamento e a seguir será gerado uma tabela</h3>
                  </v-card-item>
                </v-card>
                <v-card  height="300" v-if="(n==3)">
                  <v-card-item class="d-flex justify-center align-center">
                    <p style="color:green; font-size:50px;"> <b>Passo 3: Seleção das colunas de teste</b></p>
                  </v-card-item>
                  <v-card-item class="d-flex justify-left align-center">
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Selecione os check-box's apresentados na tabela gerada a partir do arquivo de treino.</h3>
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Por padrão nenhuma está selecionada, na hora do treino, seu valor padrão é de todas as colunas.</h3>
                  </v-card-item>
                </v-card>
                <v-card  height="300" v-if="(n==4)">
                  <v-card-item class="d-flex justify-center align-center">
                    <p style="color:green; font-size:50px;"> <b>Passo 4: Treinamento</b></p>
                  </v-card-item>
                  <v-card-item class="d-flex justify-left align-center">
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Clique no botão "Treinar"</h3>
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Será iniciado o treinamento a partir das configurações setadas para o arquivo de treino.</h3>
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Aguarde o processo terminar, não se preoupe, pode levar alguns minutos...</h3>
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Após o enceramento do processo, será gerado o gráfico de erro e sua matriz de confusão</h3>
                  </v-card-item>
                </v-card>
                <v-card  height="300" v-if="(n==5)">
                  <v-card-item class="d-flex justify-center align-center">
                    <p style="color:green; font-size:50px;"> <b>Passo 5: Teste</b></p>
                  </v-card-item>
                  <v-card-item class="d-flex justify-left align-center">
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Insira o arquivo de teste no campo indicado ("arquivo de teste")</h3>
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Clique no botão testar</h3>
                    <h3> <v-icon size="x-small" icon="mdi-star-three-points-outline"></v-icon> Assim como no passo anterior, o processo pode levar alguns minutos...</h3>
                  </v-card-item>
                </v-card>
              </v-window-item>
            </v-window>

            <v-card-actions class="justify-space-between">
              <v-btn variant="plain" icon="mdi-chevron-left" @click="prev"></v-btn>
              <v-item-group v-model="onboarding" class="text-center" mandatory>
                <v-item v-for="n in length" :key="`btn-${n}`" v-slot="{ isSelected, toggle }" :value="n">
                  <v-btn :variant="isSelected ? 'outlined' : 'text'" icon="mdi-record" @click="toggle"></v-btn>
                </v-item>
              </v-item-group>
              <v-btn variant="plain" icon="mdi-chevron-right" @click="next"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <div class="text-center">
        <v-dialog v-model="dialogStudents" max-width="1000">
          <template v-slot:activator="{ props }">
            <v-btn variant="text" title="Desenvolvedores" v-bind="props" icon="mdi-account-group-outline"></v-btn>
          </template>

          <v-card>
            <v-card-text>
              <h2>Desenvolvedores</h2>
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card v-bind="props" :color="isHovering ? 'primary' : undefined">
                    <v-row>
                      <v-col cols="10" sm="2">
                        <div class="ma-4">
                          <v-img class="bg-white" width="150" :aspect-ratio="1" src="./assets/paulo.jpg" cover></v-img>
                        </div>
                      </v-col>
                      <v-col class="mt-3">
                        <h5>Paulo Henrique Vieira Barreto</h5>
                        <h6>261811215</h6>
                      </v-col>
                    </v-row>
                  </v-card>
                </template>
              </v-hover>

              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card v-bind="props" :color="isHovering ? 'primary' : undefined">
                    <v-row>
                      <v-col cols="10" sm="2">
                        <div class="ma-4">
                          <v-img class="bg-white" width="150" :aspect-ratio="1" src="./assets/flavio.jpg" cover></v-img>
                        </div>
                      </v-col>
                      <v-col class="mt-3">
                        <h5>Flavio Roso Gonçalves</h5>
                        <h6>261810987</h6>
                      </v-col>
                    </v-row>
                  </v-card>
                </template>
              </v-hover>
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card v-bind="props" :color="isHovering ? 'primary' : undefined">
                    <v-row>
                      <v-col cols="10" sm="2">
                        <div class="ma-4">
                          <v-img class="bg-white" width="150" :aspect-ratio="1" src="./assets/davi.jpg" cover></v-img>
                        </div>
                      </v-col>
                      <v-col class="mt-3">
                        <h5>Davi Aparecido</h5>
                        <h6>261742876</h6>
                      </v-col>
                    </v-row>
                  </v-card>
                </template>
              </v-hover>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="dialogStudents = false">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-app-bar>

    <v-main>
      <Conteudo />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
const theme = ref('dark')

function onClick() {
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
  data: () => ({
    dialogGuide: false,
    dialogStudents: false,
    length: 5,
    onboarding: 0,
  }),
  methods: {
    next() {
      this.onboarding = this.onboarding + 1 > this.length
        ? 1
        : this.onboarding + 1
    },
    prev() {
      this.onboarding = this.onboarding - 1 <= 0
        ? this.length
        : this.onboarding - 1
    },
  }
}
</script>
