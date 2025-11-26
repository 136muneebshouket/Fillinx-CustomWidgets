# Template Blocks

A modern web application for creating, managing, and previewing custom HTML/CSS/JavaScript blocks with live preview and multi-shop support.

## 🚀 Features

- **Code Editor**: Monaco Editor integration for HTML, CSS, JavaScript, and more
- **Live Preview**: Real-time iframe preview with dynamic height calculation
- **Multi-Tab Editor**: Separate tabs for HTML, CSS, JS, HEAD, DATA, TRANSLATIONS, and SCHEMA
- **Shop Management**: Global or shop-specific block deployment
- **Multi-Select Shops**: Assign blocks to multiple shops with an intuitive combobox interface
- **State Management**: Zustand for efficient global state management
- **API Integration**: Full CRUD operations with API integration
- **Dark/Light Mode**: Theme toggle support
- **Responsive Design**: Resizable panels for optimal workspace
- **Toast Notifications**: User feedback with Sonner

## 🛠️ Tech Stack

### Core
- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library (New York style)
- **Lucide React** - Icon library

### State & Data
- **Zustand** - State management (React 19 compatible)
- **SWR** - Data fetching and caching
- **Axios** - HTTP client

### Editor & Preview
- **Monaco Editor** - VS Code-like code editor
- **Handlebars.js** - Template engine for preview
- **Dynamic Height Calculation** - Auto-adjusting iframe height

### UI Components
- **Radix UI** - Headless UI components
- **React Resizable Panels** - Resizable layout panels
- **Sonner** - Toast notifications
- **cmdk** - Command palette

## 📁 Project Structure

```
template-blocks/
├── app/
│   ├── custom-blocks/
│   │   └── new/
│   │       └── page.tsx          # Create new custom block page
│   ├── globals.css               # Global styles with CSS variables
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page with blocks list
├── components/
│   └── ui/                       # shadcn/ui components
├── hooks/
│   └── use-custom-blocks.ts      # SWR hook for fetching blocks
├── lib/
│   ├── api/
│   │   ├── api-service.ts        # API client functions
│   │   └── swr-keys.ts           # SWR cache keys
│   ├── api-paths/
│   │   └── api-paths.ts          # Centralized API endpoints
│   ├── hooks/
│   │   └── use-custom-blocks-state.ts  # State management hooks
│   ├── recoil/
│   │   └── custom-blocks-state.ts      # Zustand store
│   └── utils.ts                  # Utility functions
└── public/                       # Static assets
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd template-blocks
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

```bash
pnpm dev       # Start development server with Turbopack
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

## 🎨 Key Features Explained

### Custom Block Editor

The editor provides a complete development environment for creating custom blocks:

- **7 Editor Tabs**: HTML, CSS, JavaScript, HEAD, DATA, TRANSLATIONS, SCHEMA
- **Syntax Highlighting**: Full Monaco Editor support with IntelliSense
- **Theme Support**: Matches app theme (dark/light mode)
- **Auto-save State**: All changes are managed in global state

### Live Preview

The preview panel shows real-time rendering of your custom block:

- **Dynamic Height**: Automatically calculates and adjusts iframe height
- **PostMessage Communication**: Iframe communicates height changes to parent
- **Sandbox Security**: Safe execution of user code
- **Handlebars Support**: Template rendering with data binding

### Shop Assignment

Flexible deployment options for custom blocks:

- **Global**: Deploy to all shops
- **Shop-Specific**: Select individual shops with multi-select combobox
- **Visual Feedback**: Badge showing number of selected shops

### State Management

Efficient state management with Zustand:

```typescript
// Example usage
const { blocks, addBlock, updateBlock, deleteBlock } = useCustomBlockStore();
```

## 🔌 API Integration

### Endpoints

All API endpoints are centralized in `lib/api-paths/api-paths.ts`:

```typescript
ApiPaths.customBlocks.getList()           // GET all blocks
ApiPaths.customBlocks.create()            // POST new block
ApiPaths.customBlocks.getById(id)         // GET block by ID
ApiPaths.customBlocks.updateById(id)      // PUT update block
ApiPaths.customBlocks.deleteById(id)      // DELETE block
```

### Data Structure

Custom blocks are stored with the following structure:

```typescript
{
  id: string;
  title: string;
  html: string;
  css: string;
  js: string;
  head: string;
  data: string;
  translations: string;
  schema: string;
  height: number;
  generated_html: string;
  shopType: 'global' | 'shop';
  shops: Array<{ id: string; name: string }>;
  status: boolean;
}
```

## 🎨 Theming

The project uses CSS variables for theming, defined in `app/globals.css`:

- **Dark Mode**: Pure black backgrounds (OKLCH color space)
- **Light Mode**: Clean white backgrounds
- **Consistent Colors**: Semantic color tokens for maintainability

## 📦 Components

Built with shadcn/ui components:

- Button, Card, Dialog, Dropdown Menu
- Input, Label, Textarea, Switch
- Tabs, Popover, Command
- Resizable Panels

## 🔐 Security

- **Sandbox Attribute**: Iframes run with `sandbox="allow-scripts"`
- **Origin Validation**: PostMessage events verify origin
- **Type Safety**: Full TypeScript coverage

## 🚧 Development

### Adding a New Feature

1. Create necessary types in `lib/recoil/custom-blocks-state.ts`
2. Add API endpoints in `lib/api-paths/api-paths.ts`
3. Create hooks in `lib/hooks/use-custom-blocks-state.ts`
4. Build UI components in `app/` directory

### Code Style

- Use TypeScript strict mode
- Follow shadcn/ui component patterns
- Keep components small and focused
- Use hooks for logic separation

## 🐛 Known Issues

- None currently

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

Built with ❤️ for Tapday
