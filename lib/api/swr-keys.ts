/**
 * SWR Cache Keys
 * Centralized cache key definitions for SWR
 */

export const SWRKeys = {
  customBlocks: {
    list: 'custom-blocks-list',
    detail: (id: string) => `custom-block-${id}`,
  },
};
