import { ofetch } from 'ofetch'
import { Sequel } from './types'

const ANILIST_URL = 'https://graphql.anilist.co'
const JIKEN_BASE_URL = 'https://api.jikan.moe/v4'

export async function getAnime(name: string): Promise<Sequel[]> {
  let animes: any[] = []
  try {
    const anilistQuery = `
      query ($search: String) {
        Page(page: 1, perPage: 10) {
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
            }
            episodes
            status
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
          }
        }
      }
    `
    const response = await ofetch(ANILIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: anilistQuery, variables: { search: name } }),
    })
    animes = response.data.Page.media
  } catch {
    console.warn('Anilist Failed')
    // Fallback to Jikan API if AniList fails
    const response = await ofetch('/anime', { baseURL: JIKEN_BASE_URL, query: { q: name } })
    animes = response.data
  }

  if (animes.length == undefined) throw new Error('Rest Api Error')

  const similarAnimes = animes.map<Sequel>((anime: any) => {
    const isAniList = anime.startDate !== undefined
    return {
      Name: isAniList ? (anime.title.english ?? anime.title.romaji) : (anime.title_english ?? anime.title),
      'Original Name': isAniList ? anime.title.romaji : anime.title,
      Videography: 'Anime',
      'Total Episodes Count': anime.episodes,
      'Completed Episodes Count': 0,
      'Release Status': isAniList ? (anime.status === 'FINISHED' ? 'Released' : 'Ongoing') : anime.aired.to ? 'Released' : 'Ongoing',
      'Watch Status': 'Watching',
      'Release Date': isAniList
        ? {
            start: anime.startDate ? `${anime.startDate.year}-${String(anime.startDate.month).padStart(2, '0')}-${String(anime.startDate.day).padStart(2, '0')}` : null,
            end: anime.endDate ? `${anime.endDate.year}-${String(anime.endDate.month).padStart(2, '0')}-${String(anime.endDate.day).padStart(2, '0')}` : null,
          }
        : {
            start: anime.aired.from?.split('T')[0] ?? null,
            end: anime.aired.to?.split('T')[0] ?? null,
          },
      Language: ['English', 'Japanese'],
    }
  })

  /* const filteredAnimes = similarAnimes.filter((anime) => anime.Name === name || anime['Original Name'] === name)
  
    if (filteredAnimes.length === 0) {
      return filteredAnimes
    } */

  return similarAnimes
}
