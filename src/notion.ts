import { Client } from '@notionhq/client'
import consola from 'consola'
import { exit } from 'node:process'
import { Sequel } from './types'

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})
const NOTION_SEQUEL_DB_ID = process.env.NOTION_SEQUEL_DB_ID!

export function createSequel(data: Sequel) {
  return notion.pages.create({
    parent: {
      database_id: NOTION_SEQUEL_DB_ID,
    },
    properties: {
      Name: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: data.Name,
            },
          },
        ],
      },
      'Original Name': {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            annotations: {
              bold: false,
              italic: true,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            text: {
              content: data['Original Name'],
              link: null,
            },
          },
        ],
      },
      Videography: {
        type: 'select',
        select: {
          name: data.Videography,
        },
      },
      'Total Episodes Count': {
        type: 'number',
        number: data['Total Episodes Count'],
      },
      'Completed Episodes Count': {
        type: 'number',
        number: data['Completed Episodes Count'],
      },
      'Release Status': {
        type: 'status',
        status: {
          name: data['Release Status'],
        },
      },
      'Watch Status': {
        type: 'status',
        status: {
          name: data['Watch Status'],
        },
      },
      'Release Date': {
        type: 'date',
        date: { ...data['Release Date'] },
      },
      Language: {
        type: 'multi_select',
        multi_select: data.Language.map((lang) => ({
          name: lang,
        })),
      },
    },
  })
}

export async function getSequel(id?: string): Promise<Sequel | Sequel[]> {
  if (id == undefined) {
    const { results } = await notion.databases.query({ database_id: NOTION_SEQUEL_DB_ID })

    // @ts-ignore
    return results.map(({ id, properties }) => {
      return {
        Name: properties.Name.title[0].text.content,
        'Original Name': properties['Original Name'].rich_text[0]?.text.content,
        Videography: properties['Videography'].select.name,
        'Total Episodes Count': properties['Total Episodes Count'].number,
        'Completed Episodes Count': properties['Completed Episodes Count'].number,
        'Release Status': properties['Release Status'].status.name,
        'Watch Status': properties['Watch Status'].status.name,
        'Release Date': properties['Release Date'].date as { start: string; end: string },
        Language: properties['Language'].multi_select.map(({ name }: { name: string }) => name),
      }
    })
  } else {
    const { results } = await notion.databases.query({ database_id: NOTION_SEQUEL_DB_ID })
    const result = results.find((item) => item.id === id)

    if (!result) {
      consola.error('Item Not Found')
      exit(1)
    }

    // @ts-ignore
    const properties = result.properties
    return {
      Name: properties.object.Name.title[0].text.content,
      'Original Name': properties['Original Name'].rich_text[0]?.text.content,
      Videography: properties['Videography'].select.name,
      'Total Episodes Count': properties['Total Episodes Count'].number,
      'Completed Episodes Count': properties['Completed Episodes Count'].number,
      'Release Status': properties['Release Status'].status.name,
      'Watch Status': properties['Watch Status'].status.name,
      'Release Date': properties['Release Date'].date as { start: string; end: string },
      Language: properties['Language'].multi_select.map(({ name }: { name: string }) => name),
    }
  }
}

export function updateSequel(id: string, data: Sequel) {
  return notion.pages.update({
    page_id: id,
    properties: {
      Name: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: data.Name,
            },
          },
        ],
      },
      'Original Name': {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            annotations: {
              bold: false,
              italic: true,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            text: {
              content: data['Original Name'],
              link: null,
            },
          },
        ],
      },
      Videography: {
        type: 'select',
        select: {
          name: data.Videography,
        },
      },
      'Total Episodes Count': {
        type: 'number',
        number: data['Total Episodes Count'],
      },
      'Completed Episodes Count': {
        type: 'number',
        number: data['Completed Episodes Count'],
      },
      'Release Status': {
        type: 'status',
        status: {
          name: data['Release Status'],
        },
      },
      'Watch Status': {
        type: 'status',
        status: {
          name: data['Watch Status'],
        },
      },
      'Release Date': {
        type: 'date',
        date: { ...data['Release Date'] },
      },
      Language: {
        type: 'multi_select',
        multi_select: data.Language.map((lang) => ({
          name: lang,
        })),
      },
    },
  })
}

export async function deleteSequel(id: string): Promise<boolean> {
  return true
}
