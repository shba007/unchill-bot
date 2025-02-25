import { defineCommand, runMain as _runMain } from 'citty'
import consola from 'consola'

import { name, description, version } from '../package.json'
import { input, select } from '@inquirer/prompts'
import { getAnime } from '.'
import { createSequel } from './notion'
import { exit } from 'node:process'

export const main = defineCommand({
  meta: {
    name,
    description,
    version,
  },
  args: {
    name: {
      type: 'string',
      description: 'Name of the show',
    },
  },
  async run({ args }) {
    if (args.verbose) {
      process.env.DEBUG = process.env.DEBUG || 'true'
    }

    const showName =
      args.name ??
      (await input({
        message: 'Name of the show: ',
      }))

    const similarAnimes = await getAnime(showName)
    let selectedIndex = 0

    if (similarAnimes.length === 0) {
      consola.warn('No Result Found')
      exit(0)
    }

    consola.log(`Found result ${similarAnimes.length}`)

    if (similarAnimes.length !== 1) {
      selectedIndex = await select({
        message: 'Select show from the result: ',
        choices: similarAnimes.map(({ Name }, index) => ({ name: Name, value: index })),
      })
    }

    await createSequel(similarAnimes[selectedIndex])
  },
})

export const runMain = () => _runMain(main)
