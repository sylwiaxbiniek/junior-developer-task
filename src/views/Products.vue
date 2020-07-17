<template>
  <div id="all-items">
    <v-row>
      <v-col cols="1"></v-col>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-simple-table>
            <thead>
              <tr>
                <td>
                  <h1 class="font-weight-bold, display-2">Products</h1>
                </td>
                <td>
                  <v-btn fab depressed small dark color="blue" v-bind="attrs" v-on="on">
                    <span class="material-icons">add</span>
                  </v-btn>
                </td>
              </tr>
            </thead>
          </v-simple-table>
        </template>
        <v-card>
          <v-card-title>
            <span class="font-weight-bold, display-1">Product</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveItem">
              <v-container>
                <div>
                  <v-progress-linear indeterminate color="yellow darken-2"></v-progress-linear>
                </div>
                <v-row>
                  <v-col cols="3">
                    <v-text-field v-model="id" label="Id" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="name"
                      label="Product name"
                      placeholder="Harry Potter"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="url"
                      label="Url"
                      placeholder="http://example.com"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="prize"
                      label="Prize"
                      placeholder="9.99"
                      suffix="zł"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>all fields are required</small>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="blue darken-1" text @click.stop="dialog = false">Save</v-btn>
                <v-btn color="blue darken-1" text v-on:click="clearForm()">Close</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <template>
      <v-container class="my-10">
        <div>
          <v-progress-linear indeterminate color="yellow darken-2"></v-progress-linear>
        </div>
        <v-simple-table class="table table-hover">
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Name</th>
              <th class="text-left">Url</th>
              <th class="text-left">Prize</th>
              <th class="text-left">Actions</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" v-bind:key="index">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.url }}</td>
              <td>{{ item.prize }}zł</td>
              <td>
                <v-btn v-on:click="deleteItem(index)" class="ma-2" text icon color="blue">
                  <span class="material-icons">delete</span>
                </v-btn>
              </td>
              <td>
                <v-btn v-on:click="editProduct(index)" class="ma-2" text icon color="blue">
                  <span class="material-icons">create</span>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-container>
    </template>
  </div>
</template>

<style>

td {
  font-family: "Proza Libre", sans-serif;
  color: rgb(0, 0, 0);
  font-weight: 500;
}

</style>

<script>
export default {
  data() {
    return {
      items: [],
      dialog: false,
      update: false,
      item_id: null,
      id: null,
      name: null,
      url: null,
      prize: null
    };
  },

  created: function() {
    this.fetchProductData();
  },

  methods: {
    fetchProductData: function() {
      this.$http.get("http://localhost:3000/products").then(
        response => {
          this.items = response.body;
        },
        response => {
          console.log(response);
        }
      );
    },

    saveItem: function() {
      let newItem = {
        id: Number(this.id),
        name: this.name,
        url: this.url,
        prize: Number(this.prize)
      };
      if (this.update) {
        this.putItem(newItem, this.item_id);
      } else {
        this.postItem(newItem);
      }
      this.clearForm();
    },

    postItem: function(newItem) {
      this.$http.post(`http://localhost:3000/products`, newItem).then(() => {
        this.items.push(newItem);
      });
    },

    deleteItem: function(id) {
      this.$http.delete(`http://localhost:3000/products/${id}`).then(() => {
        this.items.splice(id, 1);
      });
    },

    putItem: function(newItem, id) {
      this.$http
        .put(`http://localhost:3000/products/${id}`, newItem)
        .then(() => {
          this.items.splice(id, 1, newItem);
        });
    },

    editProduct: function(item_id) {
      this.item_id = item_id;
      this.id = this.items[item_id].id;
      this.name = this.items[item_id].name;
      this.url = this.items[item_id].url;
      this.prize = this.items[item_id].prize;
      this.dialog = true;
      this.update = true;
    },

    clearForm: function() {
      this.item_id = null;
      this.update = false;
      this.id = null;
      this.name = null;
      this.url = null;
      this.prize = null;
      this.dialog = false;
    }
  }
};
</script>
