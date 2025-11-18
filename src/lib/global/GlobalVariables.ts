
const translationsCommentString = "/*\n TO GET TRANSLATIONS: \n" +
                                  "1. You can use the \"translationsData\" variable to grab any piece of translated text\n" +
                                  "2. All your translation data is stored right here. \n\n ";

const contentDataCommentString = "\n TO GET MAIN DATA: \n" +
                                 "1. You can use the \"contentData\" variable to access the main information or structure\n" +
                                 "2. All the core content is stored here. \n\n ";

const tagStylesCommentString = "\n TO GET STYLES: \n" +
                               "1. You can use the \"tagStylesData\" variable to look up all the custom styling\n" +
                               "2. All the style rules are stored here, ready to be applied. \n\n */";

// --- COMBINED STRING ---
/**
 * A single string containing all documentation comments, separated by two newlines (\n\n).
 */
const allCommentsCombined = translationsCommentString + '\n\n' +
                           contentDataCommentString + '\n\n' +
                           tagStylesCommentString;

export const commentsOfJsTab = allCommentsCombined;
