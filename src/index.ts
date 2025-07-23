import axios from 'axios';

interface BookResult {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  key: string;
  cover_i?: number;
  edition_count?: number;
  has_fulltext?: boolean;
  public_scan_b?: boolean;
}

interface OpenLibraryResponse {
  start: number;
  num_found: number;
  docs: BookResult[];
}

async function searchBooks(query: string, limit: number = 10): Promise<BookResult[]> {
  try {
    console.log(`🔍 Searching for books matching: "${query}"`);
    
    const response = await axios.get<OpenLibraryResponse>('https://openlibrary.org/search.json', {
      params: {
        q: query,
        limit: limit,
        fields: 'title,author_name,first_publish_year,isbn,key,cover_i,edition_count,has_fulltext,public_scan_b'
      },
      timeout: 10000 // 10 second timeout
    });

    const { data } = response;
    console.log(`📚 Found ${data.num_found} total results, showing first ${data.docs.length}\n`);
    
    return data.docs;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`❌ API Error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        console.error('❌ Network Error: No response received from API');
      } else {
        console.error(`❌ Request Error: ${error.message}`);
      }
    } else {
      console.error(`❌ Unexpected Error: ${error}`);
    }
    throw error;
  }
}

function formatBookResult(book: BookResult, index: number): string {
  const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
  const year = book.first_publish_year ? ` (${book.first_publish_year})` : '';
  const editions = book.edition_count ? ` [${book.edition_count} editions]` : '';
  const fulltext = book.has_fulltext ? ' 📖' : '';
  const publicScan = book.public_scan_b ? ' 🌐' : '';
  
  return `${index + 1}. ${book.title}${year}
   📝 Author(s): ${authors}
   🆔 OpenLibrary ID: ${book.key}${editions}${fulltext}${publicScan}`;
}

function displayResults(books: BookResult[]): void {
  if (books.length === 0) {
    console.log('📭 No books found matching your search criteria.');
    return;
  }

  console.log('📚 Search Results:');
  console.log('==================');
  
  books.forEach((book, index) => {
    console.log(formatBookResult(book, index));
    console.log(''); // Empty line between results
  });

  console.log('Legend:');
  console.log('📖 = Has full text available');
  console.log('🌐 = Has public scan available');
}

async function main(): Promise<void> {
  // Get search query from command line arguments
  const searchQuery = process.argv[2];
  
  if (!searchQuery) {
    console.log('📖 Book Search Tool');
    console.log('==================');
    console.log('Usage: npm run dev "search terms"');
    console.log('       npm run start "search terms"');
    console.log('');
    console.log('Examples:');
    console.log('  npm run dev "lord of the rings"');
    console.log('  npm run dev "pride and prejudice"');
    console.log('  npm run dev "harry potter"');
    process.exit(1);
  }

  try {
    const books = await searchBooks(searchQuery, 10);
    displayResults(books);
  } catch (error) {
    console.log('\n💡 Tip: Try different search terms or check your internet connection.');
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
}); 