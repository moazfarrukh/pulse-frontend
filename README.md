# Pulse Frontend

A modern chat application built with Next.js, TypeScript, and SCSS.

## Features

- Real-time messaging with WebSocket support
- File attachments (images, audio, video, documents)
- Voice and video recording
- Text formatting (bold, italic, code)
- User presence indicators
- Responsive design

## Text Formatting

The chat supports several text formatting options:

- **Bold**: Wrap text with `**` (e.g., `**bold text**`)
- **Italic**: Wrap text with `*` (e.g., `*italic text*`)
- **Code**: Wrap text with backticks (e.g., `` `code text` ``)
- **Links**: Use markdown syntax `[text](url)` (e.g., `[Google](https://google.com)`)
- **Lists**: Use `-` or `*` at the beginning of lines (e.g., `- Item 1`)

### Formatting Features

#### Console Feature (Code Formatting)
The console button (📟) allows you to quickly format selected text as code. Simply:

1. Select the text you want to format
2. Click the console button in the toolbar
3. The text will be wrapped with backticks for inline code formatting

#### Link Feature
The link button (🔗) allows you to create clickable links:

1. Select the text you want to make into a link
2. Click the link button in the toolbar
3. Enter the URL when prompted
4. The text will be formatted as a clickable link

#### List Feature
The list button (📋) allows you to create bulleted lists:

1. Select the text you want to format as a list
2. Click the list button in the toolbar
3. Each line will be prefixed with a bullet point

### Visual Styling

**Code-formatted text** appears with:
- Monospace font (Monaco, Menlo, Ubuntu Mono)
- Light gray background
- Rounded borders
- Proper spacing and padding

**Link-formatted text** appears with:
- Blue color (#2563eb)
- Underlined text
- Hover effects for better UX

**List-formatted text** appears with:
- Bullet points
- Proper indentation
- Clean spacing between items

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- Built with Next.js 14 and TypeScript
- Styled with SCSS modules
- Real-time features powered by WebSocket
- State management with Zustand

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.