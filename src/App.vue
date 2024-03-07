<script setup lang="ts">
  import {onMounted ,ref,watch} from  "vue";
  import PageHeader from './components/PageHeader.vue';
  import axiosClient from "./utils/axios";
  import {Country} from "./models/country.model"
  import CountryList from "./components/CountryList.vue";


  const countriesName = ref<Country[]>([]);

  const search =ref("");
  const filteredCountries = ref<Country[]>([]);
  const page = ref(1)
  const itemsPerpage = ref(12)
  const paginatedCountries= ref<Country[]>([]);
  const totalItem = ref(0);

  const fetchCountries = async () =>{
    try {
      const {data} = await axiosClient.get('all')

      countriesName.value=data
      totalItem.value=countriesName.value.length
      
    } catch (error) {
      console.error("error",error)
    }
    
  }
  const filterCountries=()=>{
    filteredCountries.value=countriesName.value.filter( (country) => 
        country.name.common.toLowerCase().includes(search.value.toLowerCase())
    )
    
  }

  const sliceCountries = (currentCountries: Country[]) =>{
    const start = (page.value - 1) * itemsPerpage.value
    const end = page.value * itemsPerpage.value
    paginatedCountries.value = currentCountries.slice(start,end)
  }

  const changePage= (newPage:number)=>{
    page.value=newPage
  }

  onMounted(()=>{
    fetchCountries();
    
  });

  watch([countriesName,page,filteredCountries],()=>{
    sliceCountries(
      filteredCountries.value.length <= 0 && search.value ===""? 
      countriesName.value : filteredCountries.value
    )

  })


</script>

<template>
  <PageHeader></PageHeader>
  
  <div class="container max-w-screen-lg mx-auto px-6" >
    <div class="mb-8">
    <input @input="filterCountries"
    type="text" name="" id="" 
    class="border border-gray-300 rounded w-full p-1 px-4"
    v-model="search" 
    placeholder="Search by country name">
  </div>
  <div class="mb-8 flex justify-center space-x-6">
    <button 
    @click="changePage(page -1 )" 
    :disabled="page<=1" 
    :class="{'opacity-50': page<=1}"
    class="border border-gray-300 rounded p-x-2 py-0.5 hover:bg-gray-200">Previus</button>
    <button 
    @click="changePage(page +1 )" 
    :disabled="page>=(totalItem/itemsPerpage)" 
    :class="{'opacity-50': page>=(totalItem/itemsPerpage)}"
    class="border border-gray-300 rounded p-x-2 py-0.5 hover:bg-gray-200"
    >Next</button>
  </div>
    <CountryList :countriesName="paginatedCountries"></CountryList>
  </div>
</template>
