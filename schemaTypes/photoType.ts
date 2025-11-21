import {defineField, defineType} from 'sanity'

export const photoType = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Tekeningen', value: 'tekeningen'},
          {title: 'Kleikunst', value: 'kleikunst'},
          {title: 'Kleurplaten', value: 'kleurplaten'},
          {title: 'Verfwerk', value: 'verfwerk'},
          {title: 'Knutsels', value: 'knutsels'},
          {title: 'Bouwwerken', value: 'bouwwerken'},
          {title: 'LEGO', value: 'lego'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      category: 'category',
    },
    prepare({title, media, category}) {
      return {
        title,
        subtitle: category,
        media,
      }
    },
  },
})

