<!-- eslint-disable no-console -->
<script setup lang="ts">
import { GetUser } from '~/logic/dbSDK'
import type { User } from '~/logic/types'
import { getUserData } from '~/logic/utils'

const isConnected = ref<Boolean>(false)
const bizName = ref<String>('')
// const currtheme = ref<String>('')
// const currLang = ref<String>('')
const color = ref<String>('')

onMounted(async () => {
  // const { userEmail, userSub } = getSecrets()
  const sec1: any = await getUserData('userSub')
  // const sec2: any = await getUserData('apikey')
  const sec3: any = await getUserData('userEmail')
  bizName.value = sec1
  isConnected.value = !!sec1.userSub && !!sec3.userEmail

  // currtheme.value = theme
  // currLang.value = lang
  // isConnected.value = connectionStatus
  const user: User = await GetUser('email', sec3.userEmail)
  console.log(sec1, sec3, user, isConnected.value)
  if (+user.total)
    isConnected.value = true
  color.value = isConnected.value ? 'text-emerald-500' : 'text-red-500'
  // chrome.storage.local.set({ conn: isConnected.value, email: sec2.userEmail })
})

const openOptionsPage = () => {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-[500px] px-4 py-5 text-center bg-gray-900">
    <div class="group flex items-center w-fit hover:bg-gray-100 hover:bg-opacity-10 pl-[5px] pr-4 py-[5px] font-semibold rounded transition-all duration-300 cursor-pointer dark:bg-blue-200 text-gray-400 mb-1">
      <a href="https://d-suite-website.vercel.app/" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 14.5l-3-3l3-3m-3 3h11" /><path d="M16.5 9.5V5.495a1 1 0 0 0-.883-.993l-.12-.007L13.5 4.5m-6 0l-1.998-.005a1 1 0 0 0-.995.881l-.007.12v10.997a1 1 0 0 0 1 1l10 .006a1 1 0 0 0 .994-.882l.006-.117V14" /><path d="M8.5 3.5h4a1 1 0 1 1 0 2h-4a1 1 0 1 1 0-2z" /></g></svg>
      </a>
      <span class="font-normal group-hover:opacity-100 opacity-0 transition-all duration-300 group-hover:translate-x-1 transform -translate-x-2 ">
        Visit the website
      </span>
    </div>
    <p class="btn transition duration-300 text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-sky-700">
      Stay Noted
    </p>
    <h1 class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl dark:text-white">
      D-Note
      <span class="bg-blue-100 text-blue-800 text-2xl font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2">Free</span>
    </h1>

    <p v-if="isConnected" class="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-300">
      D-Note is a business utility app for taking notes per page in Daftra ERP. All notes are stored securely and can be accessed from the
      <button class=" transition-all duration-200 bg-sky-400/40 transition duration-300 rounded px-1 hover:text-sky-300 hover:bg-sky-400/10" @click="openOptionsPage">
        Dashboard
      </button>
      so you would never miss what's next.
    </p>
    <button
      v-if="!isConnected" class="text-3xl text-sky-100 bg-gradient-to-r from-emerald-500 to-sky-500 background-animate rounded px-5 py-3 my-5 transition-all duration-150 font-bold hover:scale-102 transform" @click="openOptionsPage"
    >
      Connect Now
      <svg class="w-7 inline-block fill-sky-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>open-in-new</title><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" /></svg>
    </button>

    <div class="flex items-center justify-center space-x-5 mt-2 text-gray-300">
      <div class="">
        <span class="opacity-50">
          Theme:
        </span>
        <span>
          Dark
        </span>
      </div>
      <div class="">
        <span class="opacity-50">
          Status:
        </span>
        <span :class="color">
          {{ isConnected ? "Active" : "Disconnected" }}
        </span>
      </div>
    </div>
    <a href="https://github.com/taricov" class="btn my-2 text-xs transition duration-150 group" @click="openOptionsPage">
      Developed by Taric Ov <span class="group-hover:translate-x-1 transform transition duration-300 inline-block">→</span>
    </a>
    <p class="text-xs font-normal my-0 text-gray-300 opacity-80 hover:opacity-100 transition duration-150">
      This tool is part of the large business toolkit
      <a class="underline transition-all duration-200 hover:text-sky-300" href="https://dsuite.com/dnotes">
        D-Suite</a>
      that aims to improve the digital experience for businesses in MENA.
    </p>
  </main>
</template>

<style scoped>
.background-animate {
    background-size: 400%;

    -webkit-animation: AnimationName 10s ease infinite;
    -moz-animation: AnimationName 10s ease infinite;
    animation: AnimationName 10s ease infinite;
  }

  @keyframes AnimationName {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
</style>
