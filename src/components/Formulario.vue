<template>
  <v-card>
    <v-form v-model="valid" ref="form">
      <v-container fluid>
        <h5>Configurações de neurônios</h5>
        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="9" sm="3">
            <v-text-field label="Camada de entrada"  hide-details="auto" disabled v-model="form.qtdEntrada"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="3">
            <v-text-field label="Camada de Saída" hide-details="auto" disabled v-model="form.qtdSaida"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="3">
            <v-text-field type="number" :disabled="trava" label="Camada Oculta" :rules="rules" required hide-details="auto" v-model="form.camadaOculta"></v-text-field>
          </v-col>
        </v-row>

        <h5>Configurações de teste</h5>
        <v-row align="baseline"  class="mb-4">
          <v-col class="d-flex" cols="9" sm="2">
            <v-text-field type="number" :disabled="trava" label="Valor do erro" :rules="rules" hide-details="auto" required v-model="form.valorErro"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="2">
            <v-text-field type="number" :disabled="trava" label="Nº de interações" :rules="rules" hide-details="auto" required v-model="form.nrInteracoes"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="2">
            <v-text-field type="number" :disabled="trava" label="Tx. aprendizagem" :rules="rules" hide-details="auto" required v-model="form.txAprendizagem"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="9" sm="3">
            <v-select :disabled="trava" :items="items" label="Função de Transferência" :rules="rules" required v-model="form.funcaoTransf"></v-select>
          </v-col>
        </v-row>

        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="9" sm="9">
            <v-file-input :disabled="trava" counter v-on:change="saveTreino"  required show-size accept=".csv"
              label="Arquivo de Treino"></v-file-input>
          </v-col>
        </v-row>

        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="9" sm="9">
            <v-file-input v-on:change="saveTeste" :rules="rulesFile" required show-size accept=".csv" :disabled="!trava"
              label="Arquivo de Teste"></v-file-input>
          </v-col>
        </v-row>
        <v-row align="left" class="v-row align-center mb-4">
          <v-div class="d-flex justify-center align-baseline" style="gap: 1rem">
            
          </v-div>
        </v-row>
        <v-row align="left" class="d-flex justify-center float-left mb-4">
          <v-div class="d-flex justify-center align-baseline" style="gap: 1rem">
            <v-btn color="success" @click="loadTreino()" v-model="btn">
              Carregar arquivo de treino
            </v-btn>
            <v-btn color="success" @click="initTreino()" v-model="btn">
              Iniciar Treino
            </v-btn>
            <v-btn color="success" @click="initTeste()" v-model="btn" :disabled="!trava">
              Iniciar Teste
            </v-btn>
            <v-btn color="red" @click="cancel()">
              Limpar
            </v-btn>
          </v-div>
        </v-row>
      </v-container>
      <hr>
      <v-container fluid :hidden="oculto">
        <v-table fixed-header height="300px" style="border-top: 2px">
          <thead>
            <tr>
              <th class="text-left" v-for="h in header"  style="color: red">
                {{ h }}
                <input v-if="h != header.at(header.length-1)" type="checkbox" id="h" value="h" v-model="checked" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dados">
              <td  v-for="col in item">{{ col }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'Formulario',
  data: () => ({
    valid: true,
    rules:[v => !!v || 'Campo obrigatório'],
    rulesFile:[v => !!v || 'File is required'],
    //rulesTeste:[v => !!v || 'Envie o arquivo de teste',v => (v && v.size > 0) || 'Insira o arquivo de teste'],
    fileInput: "",
    form:{
      funcaoTransf:"",
      txAprendizagem: "",
      nrInteracoes: "",
      valorErro: "",
      camadaOculta: "",
      qtdEntrada: 0,
      qtdSaida: 0,
    },
    tab: "",
    fileTreino: [],
    fileTeste: [],
    jsonFile: "",
    jsonObject: "",
    oculto: true,
    trava: false,
    btn: "Treinar",
    listItens: [],
    arrayClass: [],
    columns: "",
    items: ['Linear', 'Logística', 'Hiperbólica'],
    header: [],
    dados: [],
    dadosTabela: [],
  }),
  methods: {
    loadTreino()
    {
      this.sendFileTreino();
      this.oculto = false;
    },
    initTreino()
    {
      this.$refs.form.validate().then(
        resp =>{
          if(resp.valid)
          {
            this.sendTreino();
            this.trava = true;
          }
          else
            return;
        }
      );
    },
    sendTreino()
    {
      let dataForm = JSON.stringify(this.form);
      console.log(JSON.stringify(this.form));
      fetch(`http://localhost:8081/sendTreino`, {
        method: 'POST',
        body: dataForm,
      });
    },
    cancel()
    {
      this.oculto = true;
      this.trava = false;
      this.$refs.form.reset();
    },
    saveTreino(e) {
      this.fileTreino = e.target.files;
    },
    saveTeste(e){
      this.fileTeste = e.target.files;
    },
    async sendFileTreino() {
      let dataForm = new FormData();
      dataForm.append('file', this.fileTreino[0]);
      let res = await fetch(`http://localhost:8081/uploadFile`, {
        method: 'POST',
        body: dataForm,
      });
      await this.readFile();
    },
    async sendTeste() {
      let dataForm = new FormData();
      dataForm.append('file', this.fileTeste[0]);
      let res = await fetch(`http://localhost:8081/uploadFile`, {
        method: 'POST',
        body: dataForm,
      });
      let data = await res.json();
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
      this.form.qtdEntrada = this.header.length-1;
      this.setValuesTable(columns);
    },
    createObject(values)
    {
      var obj = {}; let i=0;
      this.header.forEach(element => {
        obj[element] = values[i++];
      });
      this.dadosTabela.push(obj);
    },
    setValuesTable(columns)
    {
      let matrix = [];
      let line,i=0;
      this.jsonObject.forEach(element => {
        matrix[i] = [];
        line = Object.values(element).toString();
        line = line.split(",");
        for(let j=0; j<line.length;j++)
        {
          matrix[i][j] = line[j];
          if(j==line.length-1)
          {
            if(!this.arrayClass.includes(line[j]))
              this.arrayClass.push(line[j]);
          }
        }
        this.createObject(line);
        this.dados.push(matrix[i]);
        i++;
      });
      this.form.qtdSaida = this.arrayClass.length;
    }
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