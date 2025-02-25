import { ofetch } from 'ofetch'
import { Sequel } from './types'

const JIKEN_BASE_URL = 'https://api.jikan.moe/v4'

export async function getAnime(name: string): Promise<Sequel[]> {
  const animes: any[] = (await ofetch('/anime', { baseURL: JIKEN_BASE_URL, query: { q: name } })).data
  //.filter(({ title, title_english }) => title === name || title_english === name)

  if (animes.length == undefined) throw new Error('JIKEN Rest Api Error')

  const similarAnimes = animes.map<Sequel>((anime: any) => ({
    Name: anime.title_english ?? anime.title,
    'Original Name': anime.title,
    Videography: 'Anime',
    'Total Episodes Count': anime.episodes,
    'Completed Episodes Count': 0,
    'Release Status': anime.aired.to ? 'Released' : 'Ongoing',
    'Watch Status': 'Watching',
    'Release Date': {
      start: anime.aired.from?.split('T')[0] ?? null,
      end: anime.aired.to?.split('T')[0] ?? null,
    },
    Language: ['English', 'Japanese'],
  }))

  const filteredAnimes = similarAnimes.filter((anime) => anime.Name === name || anime['Original Name'] === name)

  if (filteredAnimes.length === 0) {
    return filteredAnimes
  }

  return similarAnimes
}
