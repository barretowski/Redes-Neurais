<template>
  <v-card>
    <v-form v-model="valid">
      <v-container fluid>
        <h5>Configurações de neurônios</h5>
        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="12" sm="3">
            <v-text-field label="Camada de entrada" :rules="rules" hide-details="auto" disabled v-model="config.qtdEntrada"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="12" sm="3">
            <v-text-field label="Camada de Saída" :rules="rules" hide-details="auto" disabled v-model="config.qtdSaida"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="12" sm="3">
            <v-text-field :disabled="trava" label="Camada Oculta" :rules="rules" hide-details="auto"></v-text-field>
          </v-col>
        </v-row>

        <h5>Configurações de teste</h5>
        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="12" sm="2">
            <v-text-field :disabled="trava" label="Valor do erro" :rules="rules" hide-details="auto"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="12" sm="2">
            <v-text-field :disabled="trava" label="Nº de interações" :rules="rules" hide-details="auto"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="12" sm="2">
            <v-text-field :disabled="trava" label="Tx. aprendizagem" :rules="rules" hide-details="auto"></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="12" sm="4">
            <v-select :disabled="trava" :items="items" label="Função de Transferência"></v-select>
          </v-col>
        </v-row>

        <v-row align="center" class="mb-4">
          <v-col class="d-flex" cols="12" sm="10">
            <v-file-input :disabled="trava" counter v-on:change="saveFile" show-size accept=".csv"
              label="Arquivo de Treino"></v-file-input>
          </v-col>
        </v-row>

        <v-row align="right" class="d-flex justify-center float-right mb-4">
          <v-div class="d-flex justify-center align-baseline" style="gap: 1rem">
            <v-btn :loading="loading[2]" :disabled="loading[2]" color="red" @click="load(2)">
              Limpar
            </v-btn>
            <v-btn :loading="loading[1]" :disabled="loading[1]" color="success" @click="load(1)" v-model="btn">
              {{btn}}
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
    tab: "",
    file: [],
    jsonFile: "",
    jsonObject: "",
    oculto: true,
    trava: false,
    btn: "Treinar",
    listItens: [],
    loading: [],
    arrayClass: [],
    config:{
      qtdEntrada: 0,
      qtdSaida: 0,
    },
    columns: "",
    items: ['Linear', 'Logística', 'Hiperbólica'],
    header: [],
    dados: [],
  }),
  methods: {
    load(i) {
      let resp = false;
      this.loading[i] = true;
      if(i == 1)
      {
        this.sendFile();
        resp = true;
        this.btn = "Realizar Teste";
      }
      else
      {
        this.btn = "Treinar";
      }
      setTimeout(() => (this.loading[i] = false, this.trava = resp, this.oculto = !resp), 3000)
    },
    saveFile(e) {
      this.file = e.target.files;
    },
    async sendFile() {
      let dataForm = new FormData();
      dataForm.append('file', this.file[0]);
      let res = await fetch(`http://localhost:8081/uploadFile`, {
        method: 'POST',
        body: dataForm,
      });
      let data = await res.json();
      this.readFile();
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
      this.createObject(columns.split(","));
      this.config.qtdEntrada = this.header.length-1;
      this.setValuesTable(columns);
    },
    createObject(columns)
    {
      var obj = {};
      columns.forEach(element => {
        obj[element] = element;
      });
      console.log(obj);
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
          let vl = {valor: line[j]};
          matrix[i][j] = line[j];
          if(j==line.length-1)
          {
            if(!this.arrayClass.includes(line[j]))
              this.arrayClass.push(line[j]);
          }
        }
        this.dados.push(matrix[i]);
        i++;
      });
      this.config.qtdSaida = this.arrayClass.length;
      console.log(this.arrayClass);
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