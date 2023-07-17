<!-- eslint-disable no-console -->
<script setup lang="ts">
import 'uno.css'
import { useClipboard, useMagicKeys, whenever } from '@vueuse/core'
import newNoteSound from '../../assets/sound effects/newNote.mp3'
// import notes from '../../fakedata'
import { CreateNote, GetNotes } from '../../logic/daftraApi'
// import { currPageNotes } from '../../logic/utils'
import type { NoteDataApi, User } from '../../logic/types'
import { GetUser } from '~/logic/dbSDK'
import { extractBody, extractColor, extractPath, getUserData } from '~/logic/utils'

const tabs = ref<any>('recently-added')
// const filtered = ref<Note[]>([])
const apiNotes = ref<any>([])
// const apiNotes = ref<Note[]>([])

// filtered.value = currPageNotes(notes)

const noteTextarea = ref<HTMLTextAreaElement>()
// const placeholder = ref<string>('')
const notingDisabled = ref<boolean>(true)
const apikey = ref<string>('')
const subD = ref<string>('')
const moduleKey = ref<string>('')
const form = ref<HTMLFormElement>()
const isLoading = ref<boolean>(false)
const loadingNotes = ref<boolean>(false)
const drawer = ref<boolean>(false)
const newNote = ref<any>('')
// const newNote = ref<string | ComputedRef<string>>('')
const userE = ref<any>('')
const isConnected = ref<any>(true)
const renderError = ref<string | null>(null)

const toggleDrawer = (): void => {
  drawer.value = !drawer.value
  noteTextarea.value?.focus()
}

const thisPageNotes = () => {
  const thisPath = window.location.pathname
  return apiNotes.value.filter(n =>
    extractPath(n.description) === thisPath)
}

onMounted(async () => {
  thisPageNotes()
  loadingNotes.value = true
  // const { userEmail, userSub } = getSecrets()
  // function getStorageValuePromise(key: string) {
  //   return new Promise((resolve) => {
  //     chrome.storage.sync.get(key, resolve)
  //   })
  // }

  const sec1: any = await getUserData('userSub')
  const sec2: any = await getUserData('apikey')
  const sec3: any = await getUserData('userEmail')

  // const chromeStorage1: any = await getStorageValuePromise('conn')
  // const chromeStorage2: any = await getStorageValuePromise('email')
  isConnected.value = !!sec1 && !!sec2
  userE.value = sec3
  console.log('Connected', isConnected.value, userE.value)
  if (isConnected && userE.value) {
    const user: User = await GetUser('email', userE.value.userEmail)
    // console.log(user)
    notingDisabled.value = false
    moduleKey.value = user.documents[0].note_module_key
    apikey.value = user.documents[0].api_key
    subD.value = user.documents[0].subdomain
    // console.log(apikey.value, moduleKey.value)
    const allNotesReq = await GetNotes(subD.value, apikey.value, moduleKey.value)
    const allNotes = await allNotesReq.json()
    apiNotes.value = allNotes.data
    // console.log(apiNotes.value)
    loadingNotes.value = false
  }
})

const addNote = async (): Promise<void> => {
  const VClipboard = useClipboard()
  VClipboard.copy(newNote.value)
  console.log(VClipboard.text)
  form.value?.reset()
  const today = new Date()
  const formattedToday = today.toISOString().split('T')[0]
  const noteNun = apiNotes.value.length + 1
  const thisPath: string = window.location.pathname
  const data: NoteDataApi = {
    number: {
      generated: '1',
      code: '1',
    },
    title: `Note no. ${noteNun}`,
    start_date: formattedToday,
    description: `${newNote.value}|path:${thisPath}`,
    staff_id: '0',

  }
  const msgSound: any = new Audio(newNoteSound)
  msgSound.play()
  loadingNotes.value = true
  const secrets: any = { userSub: subD.value, noteModuleKey: moduleKey.value, apikey: apikey.value }
  const sendNote = await CreateNote(secrets, data)
  console.log(sendNote)
  // console.log(JSON.stringify(data))
  if (!sendNote.ok) {
    renderError.value = 'Adding Note Failed!'
    setTimeout(() => {
      renderError.value = null
    }, 10000)
    newNote.value = VClipboard.text
  }
  const allNotesReq = await GetNotes(subD.value, apikey.value, moduleKey.value)
  const allNotes = await allNotesReq.json()
  apiNotes.value = allNotes.data
  loadingNotes.value = false
}

const keys = useMagicKeys()
whenever(keys.escape, () => {
  drawer.value = false
})
whenever(keys['\\'], () => {
  drawer.value = true
  console.log('before', newNote.value)
  newNote.value = 'Hello....'
  console.log('after', newNote.value)
  // noteTextarea.value?.focus()
  newNote.value = ''
})
</script>

<template>
  <div
    class="group fixed flex items-center justify-center right-0 bottom-0 m-5 z-100 font-sans select-none leading-1em w-10 h-10 rounded-full shadow cursor-pointer bg-[#21a6a7] hover:bg-opacity-90 transition-all duration-300 !z-[100000]"
    @click="toggleDrawer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128.65 139.81"><defs /><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M94.85,5.15,0,139.81,52.44,0H64.19Q83.17,0,94.85,5.15Z" /><polygon class="cls-2" points="52.44 0 0 139.81 0 0 52.44 0" /><path class="cls-3" d="M109.39,124.89A46.32,46.32,0,0,1,89.93,136a100.26,100.26,0,0,1-25.74,3.81H0L126.83,49.42a106.53,106.53,0,0,1,1.82,20q0,22.41-5.1,34.76a57.54,57.54,0,0,1-14.16,20.7" /><path class="cls-4" d="M126.83,49.42,0,139.81,94.85,5.15a50,50,0,0,1,19.31,14.78,61.41,61.41,0,0,1,11.06,22.42C125.85,44.67,126.38,47,126.83,49.42Z" /></g></g></svg>
  </div>

  <v-layout id="my-content-script">
    <v-navigation-drawer
      v-model="drawer"
      width="600"
      elevation="9"
      location="right"
      temporary
      class="!bg-gray-900 py-3 px-1 !z-[100000]"
    >
      <v-container>
        <h3 class="text-left text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 text-xl font-extrabold md:text-xl lg:text-3xl dark:text-white">
          Recent Notes
        </h3>
        <v-chip variant="tonal" class="block text-left text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 px-0 mb-4 text-xl font-extrabold  dark:text-white">
          Free and Open Source Tool
        </v-chip>
        <v-tabs
          v-model="tabs"
          fixed-tabs
        >
          <v-tab
            v-ripple="false"
            class="bg-sky-500 hover:!bg-sky-600 active:!bg-transparent transition duration-300" value="recently-added"
            variant="outlined"
          >
            Recently Added
          </v-tab>
          <v-tab
            v-ripple="false"
            class="bg-sky-500 hover:!bg-sky-600 transition duration-300" value="page-notes"
            variant="outlined"
          >
            Page Notes
          </v-tab>
        </v-tabs>
        <v-window v-model="tabs">
          <v-window-item
            value="page-notes"
          >
            <v-container class="!bg-slate-100 !bg-opacity-2 text-center ">
              <v-progress-circular v-show="loadingNotes" color="green" indeterminate />
              <p v-show="renderError !== null" class="w-full text-center text-red-500 font-semibold">
                {{ renderError }}
              </p>
              <v-row no-gutters>
                <v-col
                  v-for="note in thisPageNotes()"
                  :key="note.id"
                  cols="6"
                  sm="4"
                >
                  <v-text v-if="!isConnected && !userE" class="text-3xl font-bold">
                    Please Connect to start using the app...
                  </v-text>
                  <v-text v-if="!isConnected && apiNotes.length === 0" class="text-3xl font-bold">
                    You don't have any notes to display, start noting..
                  </v-text>
                  <VueCompact v-if="isConnected && userE" class="m-2" :body="extractBody(note.description)" :author="note.staff_id === 0 ? 'Admin' : `User ID: #${note.staff_id}`" :date="note.start_date" :path="note.description.split('[path]')[1]" />
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item
            value="recently-added"
          >
            <v-container class="!bg-slate-100 !bg-opacity-2 text-center">
              <v-progress-circular v-show="loadingNotes" color="green" indeterminate />

              <v-row no-gutters>
                <v-col
                  v-for="note in apiNotes.slice(0, 6)"
                  :key="note.id"
                  cols="6"
                  sm="4"
                >
                  <v-text v-if="!isConnected && !userE">
                    Please Connect to start using the app...
                  </v-text>
                  <v-text v-if="isConnected && apiNotes.length === 0">
                    You don't have any notes to display, start noting..
                  </v-text>
                  <VueCompact v-if="isConnected && userE" class="m-2" :color="extractColor(note.description)" :body="extractBody(note.description)" :author="note.staff_id === 0 ? 'Admin' : `User ID: #${note.staff_id}`" :date="note.start_date" :path="note.description.split('[path]')[1]" />
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
        <!-- <v-container class="!bg-slate-100 !bg-opacity-2"> -->
        <!-- <v-text size="x-small" class="text-xs hover:opacity-50 text-sky-100 bg-opacity-1 mx-3 cursor-pointer transition duration-300 font-normal" @click="openOptionsPage">
            Go to all notes..
          </v-text>
          <button class="btn mt-2" @click="openOptionsPage">
            Options
          </button> -->
        <!-- </v-container> -->
      </v-container>
      <v-container fluid>
        <form ref="form" @submit.prevent="addNote">
          <v-textarea
            ref="noteTextarea"
            v-model="newNote"
            :disabled="notingDisabled"
            required
            no-resize
            label="Press Shift + Enter to add notes"
            variant="outlined"
            class="text-gray-200"
            :loading="isLoading"
            @keyup.enter="addNote"
          />
        </form>
      </v-container>
    </v-navigation-drawer>
  </v-layout>
</template>

<style>
.v-navigation-drawer__scrim{
  position: fixed
}
.v-navigation-drawer__content{
  @apply !flex flex-col justify-between overflow-hidden;
}
.v-btn__overlay{
  @apply hidden
}
button:not(.v-tab--selected){
  @apply transform translate-y-2
}

.cls-1{fill:#35b0b0;}.cls-2{fill:#74c6c9;}.cls-3{fill:#115b7c;}.cls-4{fill:#168896;}
</style>
