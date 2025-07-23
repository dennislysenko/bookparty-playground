# BookParty 📚

A TypeScript-powered book search tool using the Open Library API.

## Features

- **🔍 Book Search** - Search for books with fuzzy matching
- **📖 Book Details** - Get detailed information including synopsis
- **🌐 Amazon Links** - Direct links to Amazon when available

## Quick Start

Install dependencies:
```bash
pnpm install
```

## Usage

### Search for Books
```bash
npm run dev "search terms"
```

**Examples:**
```bash
npm run dev "lord of the rings"
npm run dev "1984"
npm run dev "harry potter"
```

### Get Book Details
```bash
npm run book-details "WORK_ID"
```

**Examples:**
```bash
npm run book-details "OL893415W"           # Dune
npm run book-details "/works/OL27448W"     # Lord of the Rings
```

*💡 Get work IDs from the search results*

## What You Get

### Search Results Show:
- Title and author
- Publication year  
- Edition count
- Available formats (📖 = full text, 🌐 = public scan)

### Book Details Include:
- Full synopsis/description
- Author biographies
- Subject classifications
- Cover images
- External links (Amazon, reviews)
- Publication metadata

## Amazon Integration

Books with Amazon IDs automatically show purchase links:
```
🛒 Amazon URL: https://amazon.com/dp/1435140745
```

## API Used

- **Open Library Search API** - https://openlibrary.org/search.json
- **Open Library Works API** - https://openlibrary.org/works/{id}.json 