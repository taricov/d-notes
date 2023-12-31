/* eslint-disable no-console */
// import { useCookies } from 'vue3-cookies'
import type { Note, SecretsTypes } from './types'

// const $cookies = inject<VueCookies>('$cookies')

export function setUserData(userData: any) {
  console.log('Value is set', userData)
  // chrome.storage.local.set(userData).then(() => {
  // })
  chrome.storage.local.set(userData)
  // .then(() => {
  //   console.log('Value is set')
  // })
}
export function getUserData(key: string) {
  // console.log('Value to get',)
  return new Promise((resolve) => {
    chrome.storage.local.get(key, resolve)
  // chrome.storage.local.get(['key']).then((result: any) => {
  //   console.log(`Value currently is ${result.key}`)
  // })
  })
}
// return new Promise(() => {
// console.log('first lot', userData)
// chrome.storage.sync.set(userData)
// console.log('second lot', userData)
// })
// Set Stored secrets from cookie
export const setSecrets = ({ userEmail, userSub }: SecretsTypes): void => {
  const sData = { userEmail, userSub }
  console.log({ userEmail, userSub })
  // export const setSecrets = ({ sub_domain, apiKey, noteModuleKey, businessName, theme, lang, connectionStatus, notesCount }: SecretsType): void => {
  //   const sData = {
  //     sub_domain, apiKey, noteModuleKey, businessName, theme, lang, connectionStatus, notesCount,
  //   }
  // const { cookies } = useCookies()
  // cookies.set('myCoookie', 'abcdefg')
  // cookies.set('myCoookie2', JSON.stringify(sData))
  // document.cookie = 'dnotes=ffe'
  localStorage.setItem('connector-data', JSON.stringify(sData))
}

// Get Stored Secrets
export const getSecrets = (): SecretsTypes => {
  const secrets: string = localStorage.getItem('connector-data') ?? '{}'
  const parsedSecrets: SecretsTypes = JSON.parse(secrets)

  return parsedSecrets
}

export const currPageNotes = (notes: Note[]): Array<Note> => {
  const thisUrlPath: string = window.location.pathname
  return notes.filter((note: Note) => (note.path === '/work-orders'))
}

export const GetNoteModule = () => {

}

export const extractPath = (desc: string): string => {
  const path = desc.split('|path:')[1]
  return path === '/' ? '/dashboard' : path
}
export const extractUser = (desc: string): string => {
  const user = desc.split(']]:')[0].slice(2)
  return user ?? 'Admin'
}
export const extractBody = (desc: string): string => {
  const body = desc.split('|path:')[0].replaceAll(/#(?!\s)/g, '')
  return body.split(']]:')[1]
}
export const extractTags = (body: string): string[] => {
  const regex = /#\s*([a-zA-Z]+)/g
  const matches = Array.from(body.matchAll(regex), match => match[0])
  const _matches = matches.filter(word => /^#[a-zA-Z]/.test(word)).map(word => word.slice(1))
  console.log(`matches: ${_matches}`)
  return _matches
}

export const extractColor = (desc: string): string => {
  const regex = /_\w+/g
  const noteBody = desc.split('|path:')[0]
  const color = noteBody.match(regex) !== null ? noteBody.match(regex)![0].slice(1) : 'white'
  console.log(color)
  return color
}
