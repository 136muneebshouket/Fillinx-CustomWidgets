const translationsCommentString =
  "/*\n TO GET TRANSLATIONS: \n" +
  '1. You can use the "translationsData" variable to grab any piece of translated text\n' +
  "2. All your translation data is stored right here. \n ";

const contentDataCommentString =
  "\n TO GET DATA: \n" +
  '1. You can use the "contentData" variable to access the main information or structure\n' +
  "2. All the core content is stored here. \n ";

const schemaCommentString =
  "\n TO GET STYLES: \n" +
  '1. You can use the "schemaData" variable to look up all the custom styling\n' +
  "2. All the style rules are stored here, ready to be applied. \n */";

// --- COMBINED STRING ---
/**
 * A single string containing all documentation comments, separated by two newlines (\n\n).
 */
const allCommentsCombined =
  translationsCommentString + contentDataCommentString + schemaCommentString;

//   ////////////// default comments of translations tab ///////////////////////////////////////////////////


const translationinterfaceDeclaration = 
`type LanguageCode =
 | "af" | "ak" | "am" | "ar" | "as" | "az" | "be" | "bg" | "bm" | "bn" | "bo" | "br" | "bs" | "ca" | "ce" | "ckb" | "cs" | "cu" | "cy" | "da" | "de" | "dz" | "ee" | "el" | "en" | "eo" | "es" | "et" | "eu" | "fa" | "ff" | "fi" | "fil" | "fo" | "fr" | "fy" | "ga" | "gd" | "gl" | "gu" | "gv" | "ha" | "he" | "hi" | "hr" | "hu" | "hy" | "ia" | "id" | "ig" | "ii" | "is" | "it" | "ja" | "jv" | "ka" | "ki" | "kk" | "kl" | "km" | "kn" | "ko" | "ks" | "ku" | "kw" | "ky" | "la" | "lb" | "lg" | "ln" | "lo" | "lt" | "lu" | "lv" | "mg" | "mi" | "mk" | "ml" | "mn" | "mo" | "mr" | "ms" | "mt" | "my" | "nb" | "nd" | "ne" | "nl" | "nn" | "no" | "om" | "or" | "os" | "pa" | "pl" | "ps" | "pt" | "pt_br" | "pt_pt" | "qu" | "rm" | "rn" | "ro" | "ru" | "rw" | "sa" | "sc" | "sd" | "se" | "sg" | "sh" | "si" | "sk" | "sl" | "sn" | "so" | "sq" | "sr" | "su" | "sv" | "sw" | "ta" | "te" | "tg" | "th" | "ti" | "tk" | "to" | "tr" | "tt" | "ug" | "uk" | "ur" | "uz" | "vi" | "vo" | "wo" | "xh" | "yi" | "yo" | "zh" | "zh_cn" | "zh_tw" | "zu";`+
"\n type LanguageMap = {\n" +
"   [key in LanguageCode]?: string;\n" +
"}\n" +
"interface Translations {\n" +
"  [key: string]: LanguageMap;\n" +
"}\n" +
"let translationsData: Translations = {";

const translationComments = "/**\n" +
" * # 📝 Translation Data Editor/Writer Guide\n" +
// " *\n" +
// " * This document outlines how to correctly enter translation data into the editor.\n" +
// " * The data structure is a nested JavaScript object where:\n" +
// " *\n" +
// " * 1.  **The top-level key** is the **unique Translation Key** (or 'ID').\n" +
// " * 2.  **The nested keys** are the **two-letter ISO Language Codes** (e.g., 'en', 'es', 'fr').\n" +
// " * 3.  **The nested values** are the actual translated **strings**.\n" +
// " *\n" +
// " * All translated text must be enclosed in **single quotes (' ')**.\n" +
// " *\n" +
// " * ---\n" +
// " *\n" +
" * ## Example Structure:\n" +
" *\n" +
" * The following object shows the correct format for translation entries.\n" +
" */\n" +
"// {\n" +
"//   hello: {\n" +
"//     en: 'Hello World',\n" +
"//     es: 'Hola Mundo',\n" +
"//     fr: 'Bonjour le monde'\n" +
"//   },\n" +
"//   title: {\n" +
"//     en: 'Featured Products',\n" +
"//     es: \"Productos Destacados\",\n" +
"//     fr: \"Produits en vedette\"\n" +
"//   }\n" +
"// };\n\n" + translationinterfaceDeclaration;






// schema tabs //////////////////////////////////////////////////////////////////////////////////////////////////////

const schemaInterfaceDeclaration = 
"interface StyleProperty {\n" +
"  settingType: string;\n" +
"  type: string;\n" +
"  label: string;\n" +
"  value: any;\n" +
"}\n" +
"type StyleRule = StyleProperty[];\n" +
"interface TagStyles {\n" +
"  [id: string]: StyleRule;\n" +
"}\n" +
"let schemaData: TagStyles = { \n";



const schemaTabGuideString = "/** STYLE SCHEMA GUIDE: \n" +
                            //  "This structure maps HTML IDs to arrays of style properties to be applied.\n\n" +
                            //  "1. **Key:** Must be the EXACT HTML `id` attribute of the element (e.g., 'my-button').\n" +
                            //  "2. **Value:** An array of style objects defining the CSS properties.\n\n" +
                            //  "**Style Object Properties (Key Fields):**\n" +
                            //  " - `type`: The CSS property name (e.g., 'background-color', 'font-size').\n" +
                            //  " - `value`: The actual CSS value to be applied (e.g., '#FFFFFF', '16px').\n\n" +
                             "**Example:**\n" +
                             "{\n" +
                             "  id: [\n" +
                             "    {\n" +
                             "      settingType: \"style\",\n" +
                             "      type: \"background-color\",\n" +
                             "      label: \"Background Color\",\n" +
                             "      value: \"block\",\n" +
                             "    }\n" +
                             "  ]\n" +
                             "}\n" +
                             "**/ \n\n" + schemaInterfaceDeclaration;



// comments for data tab /////////////////////////////////////////////////////////////////////////////



const interfaceDataTab = `// 1. Define the possible literal string values for the 'dataType' property.
type ContentDataType = 'products' | 'collections' | 'mixedItems';

// 2. Define a flexible type for the content properties, allowing them to be 
// either an array of items (like Product[]) or an object (like { id: Product }).
// NOTE: For a real application, you would replace 'unknown' with specific interfaces 
// like 'Product[] | Record<string, Product>'. We use 'unknown' here for flexibility.
type ContentValue = unknown[] | Record<string, unknown>;

/**
 * Interface for a single Content Block definition.
 * This block specifies what type of content it holds and provides an optional title.
 */
interface ContentBlock {
  // Must be one of the defined literal types (products, collections, or mixedItems)
  dataType: ContentDataType;
  
  // A descriptive title for the block
  title: string;

  // The fields that hold the actual content data.
  // Their type is flexible (Array or Object) to accommodate different formats.
  collections?: ContentValue;
  products?: ContentValue;
  mixedItems?: ContentValue;
}  
let contentData: ContentBlock = {
// start writing from here 

}`

export const commentsOfJsTab = allCommentsCombined;
export const commentsOfDataTab = interfaceDataTab
export const commentsOfTranslationTab = translationComments + '\n// start writing from here  \n\n\n}';
export const commentsOfSchemaTab = schemaTabGuideString + '// start writing from here  \n\n}';
