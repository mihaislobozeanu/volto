import config from '@plone/volto/registry';
import { defineMessages } from 'react-intl';
import { cloneDeep } from 'lodash';

const messages = defineMessages({
  searchBlock: {
    id: 'Search block',
    defaultMessage: 'Search block',
  },
  controls: {
    id: 'Controls',
    defaultMessage: 'Controls',
  },
  baseSearchQuery: {
    id: 'Base search query',
    defaultMessage: 'Base search query',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  searchInputPrompt: {
    id: 'Search input label',
    defaultMessage: 'Search input label',
  },
  showSearchInput: {
    id: 'Show search input?',
    defaultMessage: 'Show search input?',
  },
  showSearchButtonTitle: {
    id: 'Show search button?',
    defaultMessage: 'Show search button?',
  },
  showSearchButtonDescription: {
    id: 'This disables the live search',
    defaultMessage: 'This disables the live search',
  },
  searchButtonLabel: {
    id: 'Search button label',
    defaultMessage: 'Search button label',
  },
  searchButtonPlaceholder: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  facets: {
    id: 'Facets',
    defaultMessage: 'Facets',
  },
  facet: {
    id: 'Facet',
    defaultMessage: 'Facet',
  },
  label: {
    id: 'Label',
    defaultMessage: 'Label',
  },
  field: {
    id: 'Field',
    defaultMessage: 'Field',
  },
  multipleChoices: {
    id: 'Multiple choices?',
    defaultMessage: 'Multiple choices?',
  },
  hideFacetTitle: {
    id: 'Hide facet?',
    defaultMessage: 'Hide facet?',
  },
  hideFacetDescription: {
    id:
      'Hidden facets will still filter the results if proper parameters are passed in URLs',
    defaultMessage:
      'Hidden facets will still filter the results if proper parameters are passed in URLs',
  },
  facetWidget: {
    id: 'Facet widget',
    defaultMessage: 'Facet widget',
  },
});

const enhanceSchema = (originalSchema, formData) => {
  const extensionName = 'facetWidgets';
  const extensionType = 'type';
  const variations =
    config.blocks.blocksConfig.searchBlock.extensions[extensionName][
      extensionType
    ];

  const activeItemName = formData?.[extensionType];
  let activeItem = variations?.find((item) => item.id === activeItemName);
  if (!activeItem) activeItem = variations?.find((item) => item.isDefault);

  const schemaEnhancer = activeItem?.['schemaEnhancer'];

  let schema = schemaEnhancer
    ? schemaEnhancer({ schema: cloneDeep(originalSchema), formData })
    : cloneDeep(originalSchema);

  return schema;
};

const FacetSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.facet),
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'field', 'type', 'multiple', 'hidden'],
    },
  ],
  properties: {
    title: {
      title: intl.formatMessage(messages.label),
    },
    field: {
      title: intl.formatMessage(messages.field),
      widget: 'select_querystring_field',
      vocabulary: { '@id': 'plone.app.vocabularies.MetadataFields' },
    },
    multiple: {
      type: 'boolean',
      title: intl.formatMessage(messages.multipleChoices),
      default: false,
    },
    hidden: {
      type: 'boolean',
      title: intl.formatMessage(messages.hideFacetTitle),
      default: false,
      description: intl.formatMessage(messages.hideFacetDescription),
    },
    type: {
      title: intl.formatMessage(messages.facetWidget),
      choices: config.blocks.blocksConfig.searchBlock.extensions.facetWidgets.types.map(
        ({ id, title }) => [id, title],
      ),
      defaultValue: config.blocks.blocksConfig.searchBlock.extensions.facetWidgets.types.find(
        ({ isDefault }) => isDefault,
      ).id,
    },
  },
  required: ['field'],
});

export default ({ data = {}, intl }) => {
  return {
    title: intl.formatMessage(messages.searchBlock),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title'],
      },
      {
        id: 'searchquery',
        title: intl.formatMessage(messages.baseSearchQuery),
        fields: ['query'],
      },
      {
        id: 'facets',
        title: intl.formatMessage(messages.facets),
        fields: ['facets'],
      },
      {
        id: 'controls',
        title: intl.formatMessage(messages.controls),
        fields: [
          'showSearchInput',
          ...(data.showSearchInput ? ['searchInputPrompt'] : []),
          'showSearchButton',
          ...(data.showSearchButton ? ['searchButtonLabel'] : []),
        ],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      searchInputPrompt: {
        title: intl.formatMessage(messages.searchInputPrompt),
      },
      showSearchInput: {
        type: 'boolean',
        title: intl.formatMessage(messages.showSearchInput),
      },
      showSearchButton: {
        type: 'boolean',
        title: intl.formatMessage(messages.showSearchButtonTitle),
        description: intl.formatMessage(messages.showSearchButtonDescription),
      },
      searchButtonLabel: {
        title: intl.formatMessage(messages.searchButtonLabel),
        placeholder: intl.formatMessage(messages.searchButtonPlaceholder),
      },
      facets: {
        title: intl.formatMessage(messages.facets),
        widget: 'object_list',
        schema: FacetSchema({ intl }),
        schemaExtender: enhanceSchema,
      },
      query: {
        title: 'Query',
      },
    },
    required: [],
  };
};