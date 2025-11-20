/**
 * GlobalApiPaths.ts
 * * Defines all backend API endpoints for the application in a structured,
 * type-safe manner. This centralizes API configuration, making it easier
 * to manage and refactor endpoints across the application.
 */

import { baseUrl } from "@/app/utils/use-fetch";

// Define the base URL for the backend service.
// NOTE: For real applications, this should often be dynamically pulled from
// environment variables (e.g., process.env.REACT_APP_API_BASE)
const TAPDAY_API_BASE_URL = baseUrl;

// --- API Path Structure ---

export const TapdayApiPaths = {
  /**
   * The base URL for the entire API, useful for health checks or documentation links.
   */
  BASE_URL: TAPDAY_API_BASE_URL,

  /**
   * Endpoints related to the 'custom-widgets' module.
   */
  customWidgets: {
    // Base path for the custom widgets module
    // BASE: `${TAPDAY_API_BASE_URL}/custom-widgets`,
    BASE: `https://darkslategray-quail-343322.hostingersite.com/api/custom-widgets`,

    /**
     * GET endpoint to fetch a list of all custom widgets.
     * @returns string - e.g., 'https://api.tapdayapi.com/v1/custom-widgets/'
     */
    // getList: `${this.BASE}`,
    getList: function () {
      return this.BASE;
    },

    /**
     * POST endpoint to create a new custom widget.
     * @returns string - e.g., 'https://api.tapdayapi.com/v1/custom-widgets'
     */
    create: function () {
      return this.BASE;
    },

    /**
     * GET endpoint to fetch a single widget by its ID.
     * @param widgetId The unique ID of the widget.
     * @returns string - e.g., 'https://api.tapdayapi.com/v1/custom-widgets/a1b2c3d4'
     */
    getById: function (widgetId: string): string {
      return `${this.BASE}/${widgetId}`;
    },

    /**
     * PUT/PATCH endpoint to update a single widget by its ID.
     * @param widgetId The unique ID of the widget.
     * @returns string - e.g., 'https://api.tapdayapi.com/v1/custom-widgets/a1b2c3d4'
     */
    updateById: function (widgetId: string): string {
      return `${this.BASE}/${widgetId}`;
    },

    /**
     * DELETE endpoint to remove a single widget by its ID.
     * @param widgetId The unique ID of the widget.
     * @returns string - e.g., 'https://api.tapdayapi.com/v1/custom-widgets/a1b2c3d4'
     */
    deleteById: function (widgetId: string): string {
      return `${this.BASE}/${widgetId}`;
    },
  },

  shops:{
    BASE: `${TAPDAY_API_BASE_URL}/shops`,

    getList: function () {
      return this.BASE + '/list';
    },

  }

  // Add other modules here as your API grows:
  // users: { /* ... endpoints */ },
  // analytics: { /* ... endpoints */ },
};

/**
 * Example Usage (outside of this file):
 * * import { TapdayApiPaths } from './GlobalApiPaths';
 * * // 1. Simple GET path
 * const listUrl = TapdayApiPaths.widgets.getList;
 * * // 2. Path with dynamic segment
 * const widgetId = 'xyz-123';
 * const specificWidgetUrl = TapdayApiPaths.widgets.getById(widgetId);
 * */
