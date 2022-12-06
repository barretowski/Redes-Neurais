<template>
  <v-card>
    <v-form v-model="valid" ref="form">
      <v-container fluid>
        <h5><v-icon icon="mdi-cog-outline" size="x-small"></v-icon> Configurações de neurônios</h5>
        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="9" sm="3">
            <v-text-field label="Camada de entrada" hide-details="auto" disabled
              v-model="form.qtdEntrada"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="3">
            <v-text-field label="Camada de Saída" hide-details="auto" disabled v-model="form.qtdSaida"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="3">
            <v-text-field type="number" label="Camada Oculta" :rules="rules" required hide-details="auto"
              v-model="form.camadaOculta"></v-text-field>
          </v-col>
        </v-row>

        <h5><v-icon icon="mdi-test-tube" size="x-small"></v-icon> Configurações de teste</h5>
        <v-row align="baseline" class="mb-4">
          <v-col class="d-flex" cols="9" sm="2">
            <v-text-field type="number" label="Valor do erro" :rules="rulesErro" hide-details="auto" required
              v-model="form.valorErro"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="2">
            <v-text-field type="number" label="Nº de interações" :rules="rulesInteracoes" hide-details="auto" required
              v-model="form.nrInteracoes"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="2">
            <v-text-field type="number" label="Tx. aprendizagem" :rules="rulesAp" hide-details="auto" required
              v-model="form.txAprendizagem"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="3">
            <v-select :items="items" label="Função de Transferência" :rules="rules" required
              v-model="form.funcaoTransf"></v-select>
          </v-col>
        </v-row>

        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="9" sm="9">
            <v-file-input counter v-on:change="saveTreino" required show-size accept=".csv"
              label="Arquivo de Treino"></v-file-input>
          </v-col>
        </v-row>

        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="9" sm="9">
            <v-file-input v-on:change="saveTeste" :rules="rulesFile" required show-size accept=".csv"
              label="Arquivo de Teste"></v-file-input>
          </v-col>
        </v-row>
        <v-row align="left" class="v-row align-center mb-4">
          <v-div class="d-flex justify-center align-baseline" style="gap: 1rem">

          </v-div>
        </v-row>
        <v-row align="left" class="d-flex justify-center float-left mb-4">
          <v-div class="d-flex justify-center align-baseline" style="gap: 1rem">
            <v-btn prepend-icon="mdi-cloud-upload" color="warning" variant="flat" @click="sendFileTreino()" :loading="loading[1]" :disabled="loading[1]" v-model="btn">
              Carregar Arquivo Treino
            </v-btn>
            <v-btn color="success" @click="initTreino(2)" :loading="loading[2]" :disabled="loading[2]" v-model="btn">
              Treinar
            </v-btn>
            <v-btn color="info" @click="sendTeste(3)" :loading="loading[3]" :disabled="loading[3]" v-model="btn">
              Testar
            </v-btn>
            <v-btn color="red" @click="cancel()">
              Limpar
            </v-btn>
          </v-div>
        </v-row>
      </v-container>
      <hr>
      <v-container fluid :hidden="oculto">
        <h5>Arquivo de treino</h5>
        <v-table fixed-header height="300px" style="border-top: 2px">
          <thead>
            <tr>
              <th class="text-left" v-for="h in header" style="color: yellow">
                <v-checkbox v-if="h != header.at(header.length - 1)" :label="h" :value="h"
                  v-model="form.checkBox"></v-checkbox>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dados">
              <td v-for="col in item">{{ col }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-container>

      <v-container v-if="(timeline.length !== 0)" style="background-color: #fff">
        <hr>
        <h5>Gráfico de erro</h5>
        <TimelineExecucao :timeline="timeline">
        </TimelineExecucao>
      </v-container>

      <v-container fluid :hidden="(Object.keys(matrizConfusao).length === 0)">
        <hr>
        <h5>Matriz de confusão</h5>
        <v-table fixed-header height="300px" style="border-top: 2px">
          <thead>
            <tr>
              <th></th>
              <th class="text-left" v-for="h in matrizConfusao.classes" style="color: red">
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in matrizConfusao.matriz">
              <td style="color: red">{{ matrizConfusao.classes[index] }}</td>
              <td v-for="col in item">{{ col }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import TimelineExecucao from './TimeLineExecucao.js'
export default {
  name: 'Formulario',
  components: {
    TimelineExecucao
  },
  data: () => ({
    valid: true,
    rules: [v => !!v || 'Campo obrigatório'],
    rulesFile: [v => !!v || 'File is required'],
    rulesErro: [v => !!v || 'Campo obrigatório', 
    v => ( v && v < 100 ) || "O erro máximo é de 100"],
    rulesAp: [v => !!v || 'Campo obrigatório', 
    v => ( v && v <= 1 ) || "A taxa de aprendizagem deve ser entre 0 e 1",
    v => ( v && v >= 0 ) || "A taxa de aprendizagem deve ser entre 0 e 1"],
    rulesInteracoes: [v => !!v || 'Campo obrigatório', 
    v => ( v && v >= 1 ) || "O número de interação deve ser maior que 0"],

    fileInput: "",
    form: {
      funcaoTransf: "",
      txAprendizagem: "",
      nrInteracoes: "",
      valorErro: "",
      camadaOculta: "",
      qtdEntrada: 0,
      qtdSaida: 0,
      arquivoTreino: "",
      checkBox: [],
    },
    tab: "",
    fileTreino: [],
    fileTeste: [],
    jsonFile: "",
    jsonObject: "",
    oculto: true,
    btn: "Treinar",
    listItens: [],
    arrayClass: [],
    columns: "",
    items: ['Linear', 'Logística', 'Hiperbólica'],
    header: [],
    loading: [],
    dados: [],
    dadosTabela: [],
    matrizConfusao: {},
    timeline: [],
  }),
  methods: {
    initTreino(i) {
      this.$refs.form.validate().then(
        resp => {
          if (resp.valid) {
            this.load(i);
            this.sendTreino();
          }
          else
            return;
        }
      );
    },
    async sendTreino() {
      let dataForm = JSON.stringify(this.form);
      console.log(JSON.stringify(this.form));
      let res = await fetch(`http://localhost:8081/sendTreino`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: dataForm,
      });
      this.timeline = await res.json();

    },
    cancel() {
      this.header = [];
      this.form.checkBox = [];
      this.oculto = true;
      this.matrizConfusao = {};
      this.timeline = [];
      this.$refs.form.reset();
    },
    saveTreino(e) {
      this.fileTreino = e.target.files;
    },
    saveTeste(e) {
      this.fileTeste = e.target.files;
    },
    async sendFileTreino() {
      this.load(1);
      let dataForm = new FormData();
      dataForm.append('file', this.fileTreino[0]);
      this.form.arquivoTreino = this.fileTreino[0].name;
      let res = await fetch(`http://localhost:8081/uploadFile`, {
        method: 'POST',
        body: dataForm,
      });
      await this.readFile();
    },
    async sendTeste(i) {
      this.load(i);
      let dataForm = new FormData();
      dataForm.append('file', this.fileTeste[0]);
      let res = await fetch(`http://localhost:8081/sendTeste`, {
        method: 'POST',
        body: dataForm,
      });
      this.matrizConfusao = await res.json();
    },
    async readFile() {
      let res = await fetch(`http://localhost:8081/getJson`, {
        method: 'GET'
      });
      this.jsonFile = await res.json();
      this.handleJson();
    },
    handleJson() {
      this.jsonObject = JSON.parse(this.jsonFile);
      let firstLine = this.jsonObject[0];
      let columns = Object.keys(firstLine).toString().toLocaleUpperCase();
      this.header = columns.split(",");
      this.form.qtdEntrada = this.header.length - 1;
      this.setValuesTable(columns);
    },
    createObject(values) {
      var obj = {}; let i = 0;
      this.header.forEach(element => {
        obj[element] = values[i++];
      });
      this.dadosTabela.push(obj);
    },
    setValuesTable(columns) {
      let matrix = [];
      let line, i = 0;
      this.jsonObject.forEach(element => {
        matrix[i] = [];
        line = Object.values(element).toString();
        line = line.split(",");
        for (let j = 0; j < line.length; j++) {
          matrix[i][j] = line[j];
          if (j == line.length - 1) {
            if (!this.arrayClass.includes(line[j]))
              this.arrayClass.push(line[j]);
          }
        }
        this.createObject(line);
        this.dados.push(matrix[i]);
        i++;
      });
      this.form.qtdSaida = this.arrayClass.length;
      this.form.camadaOculta = Math.round((this.form.qtdEntrada + this.form.qtdSaida)/2);
    },
    load(i) {
      this.loading[i] = true;
      switch (i) {
        case 1:
          setTimeout(() => (this.loading[i] = false, this.oculto = false), 5000); break;
        case 2:
          setTimeout(() => (this.loading[i] = false), 15000); break;
        case 3:
          setTimeout(() => (this.loading[i] = false), 20000); break;

      }

    },
  },

}
</script>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>