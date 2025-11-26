/**
 * API Paths Configuration
 * Centralized API endpoint definitions
 */

const API_BASE_URL = 'https://darkslategray-quail-343322.hostingersite.com/api';
const TAPDAY_API_BASE_URL = 'https://tapdaydev-99bca5867247.herokuapp.com/api'

export const ApiPaths = {
  BASE_URL: API_BASE_URL,

  customBlocks: {
    BASE: `${API_BASE_URL}/custom-widgets`,

    /**
     * GET - Fetch all custom blocks
     */
    getList: function () {
      return this.BASE;
    },

    /**
     * POST - Create a new custom block
     */
    create: function () {
      return this.BASE;
    },

    /**
     * GET - Fetch a single block by ID
     */
    getById: function (blockId: string): string {
      return `${this.BASE}/${blockId}`;
    },

    /**
     * PUT - Update a block by ID
     */
    updateById: function (blockId: string): string {
      return `${this.BASE}/${blockId}`;
    },

    /**
     * DELETE - Delete a block by ID
     */
    deleteById: function (blockId: string): string {
      return `${this.BASE}/${blockId}`;
    },
  },
  shops:{
    BASE: `${TAPDAY_API_BASE_URL}/shops`,

    getList: function () {
      return this.BASE + '/list';
    },

  }
};
