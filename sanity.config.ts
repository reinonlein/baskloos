import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// For standalone Studio deployment, projectId must be hardcoded
// For embedded Studio, it can use environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'agopwrwt'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Baskloos',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

