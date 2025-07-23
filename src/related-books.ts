import axios from 'axios';

interface BookResult {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  key: string;
  cover_i?: number;
  edition_count?: number;
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  ratings_average?: number;
  ratings_count?: number;
  want_to_read_count?: number;
  already_read_count?: number;
  subject?: string[];
  author_key?: string[];
  id_amazon?: string[];
}

interface WorkDetails {
  title: string;
  key: string;
  authors?: Array<{
    author?: {
      key: string;
    };
  }>;
  subjects?: string[];
}

interface OpenLibraryResponse {
  start: number;
  num_found: number;
  docs: BookResult[];
}

interface AuthorWorksResponse {
  entries: Array<{
    title: string;
    key: string;
    authors?: Array<{
      key: string;
      name: string;
    }>;
    first_publish_year?: number;
    subject?: string[];
  }>;
}

async function fetchWorkDetails(workId: string): Promise<WorkDetails | null> {
  try {
    const workKey = workId.startsWith('/works/') ? workId : `/works/${workId}`;
    const response = await axios.get<WorkDetails>(`https://openlibrary.org${workKey}.json`);
    return response.data;
  } catch (error) {
    console.warn(`⚠️  Could not fetch work details for ${workId}`);
    return null;
  }
}

async function getBooksBySubject(subject: string, limit: number = 10): Promise<BookResult[]> {
  try {
    const response = await axios.get<OpenLibraryResponse>('https://openlibrary.org/search.json', {
      params: {
        subject: subject,
        limit: limit,
        fields: 'title,author_name,first_publish_year,key,cover_i,edition_count,has_fulltext,public_scan_b,ratings_average,ratings_count,want_to_read_count,already_read_count,subject,author_key,id_amazon',
        sort: 'rating desc' // Sort by rating to get better quality books
      },
      timeout: 10000
    });
    
    return response.data.docs;
  } catch (error) {
    console.warn(`⚠️  Could not fetch books for subject: ${subject}`);
    return [];
  }
}

async function getBooksByAuthor(authorKey: string, limit: number = 10): Promise<BookResult[]> {
  try {
    const response = await axios.get<OpenLibraryResponse>('https://openlibrary.org/search.json', {
      params: {
        author: authorKey,
        limit: limit,
        fields: 'title,author_name,first_publish_year,key,cover_i,edition_count,has_fulltext,public_scan_b,ratings_average,ratings_count,want_to_read_count,already_read_count,subject,author_key,id_amazon',
        sort: 'rating desc'
      },
      timeout: 10000
    });
    
    return response.data.docs;
  } catch (error) {
    console.warn(`⚠️  Could not fetch books for author: ${authorKey}`);
    return [];
  }
}

async function getTrendingBooks(subject?: string, limit: number = 10): Promise<BookResult[]> {
  try {
    const params: any = {
      limit: limit,
      fields: 'title,author_name,first_publish_year,key,cover_i,edition_count,has_fulltext,public_scan_b,ratings_average,ratings_count,want_to_read_count,already_read_count,subject,author_key,id_amazon',
      sort: 'want_to_read_count desc' // Sort by popularity
    };
    
    if (subject) {
      params.subject = subject;
    } else {
      params.q = 'fiction'; // Default to fiction for general trending
    }
    
    const response = await axios.get<OpenLibraryResponse>('https://openlibrary.org/search.json', {
      params,
      timeout: 10000
    });
    
    return response.data.docs;
  } catch (error) {
    console.warn(`⚠️  Could not fetch trending books`);
    return [];
  }
}

function formatRelatedBook(book: BookResult, index: number): string {
  const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
  const year = book.first_publish_year ? ` (${book.first_publish_year})` : '';
  const rating = book.ratings_average ? ` ⭐ ${book.ratings_average.toFixed(1)}` : '';
  const popularity = book.want_to_read_count ? ` 👥 ${book.want_to_read_count} want to read` : '';
  const fulltext = book.has_fulltext ? ' 📖' : '';
  const publicScan = book.public_scan_b ? ' 🌐' : '';
  const amazon = book.id_amazon && book.id_amazon.length > 0 ? ' 🛒' : '';
  
  return `${index + 1}. ${book.title}${year}${rating}
   📝 Author(s): ${authors}
   🆔 OpenLibrary ID: ${book.key}${popularity}${fulltext}${publicScan}${amazon}`;
}

async function findRelatedBooks(workId: string): Promise<void> {
  console.log(`🔍 Finding books related to: ${workId}`);
  console.log('='.repeat(50));
  
  // First, get the details of the original book
  const originalWork = await fetchWorkDetails(workId);
  if (!originalWork) {
    console.log('❌ Could not fetch original book details');
    return;
  }
  
  console.log(`📖 Original Book: ${originalWork.title}\n`);
  
  const relatedBooks = new Map<string, BookResult>(); // Use Map to avoid duplicates
  
  // Strategy 1: Books by same subject(s)
  if (originalWork.subjects && originalWork.subjects.length > 0) {
    console.log('🏷️  Finding books with similar subjects...');
    
    // Try top 3 subjects to get variety
    const topSubjects = originalWork.subjects.slice(0, 3);
    
    for (const subject of topSubjects) {
      const subjectBooks = await getBooksBySubject(subject, 5);
      subjectBooks.forEach(book => {
        // Don't include the original book
        if (book.key !== originalWork.key) {
          relatedBooks.set(book.key, book);
        }
      });
    }
  }
  
  // Strategy 2: Books by same author(s)
  if (originalWork.authors && originalWork.authors.length > 0) {
    console.log('👤 Finding books by the same author(s)...');
    
    for (const authorRef of originalWork.authors) {
      if (authorRef.author?.key) {
        const authorBooks = await getBooksByAuthor(authorRef.author.key, 3);
        authorBooks.forEach(book => {
          if (book.key !== originalWork.key) {
            relatedBooks.set(book.key, book);
          }
        });
      }
    }
  }
  
  // Strategy 3: Add some trending books from similar subjects if we don't have enough
  if (relatedBooks.size < 8 && originalWork.subjects && originalWork.subjects.length > 0) {
    console.log('📈 Adding popular books from similar subjects...');
    const trendingBooks = await getTrendingBooks(originalWork.subjects[0], 5);
    trendingBooks.forEach(book => {
      if (book.key !== originalWork.key) {
        relatedBooks.set(book.key, book);
      }
    });
  }
  
  // Convert Map to Array and limit results
  const finalResults = Array.from(relatedBooks.values()).slice(0, 12);
  
  if (finalResults.length === 0) {
    console.log('📭 No related books found. Try searching for books in specific subjects or by author.');
    return;
  }
  
  // Sort by rating/popularity for better recommendations
  finalResults.sort((a, b) => {
    const ratingA = a.ratings_average || 0;
    const ratingB = b.ratings_average || 0;
    const popularityA = a.want_to_read_count || 0;
    const popularityB = b.want_to_read_count || 0;
    
    // Primary sort: rating, secondary: popularity
    if (ratingA !== ratingB) {
      return ratingB - ratingA;
    }
    return popularityB - popularityA;
  });
  
  console.log('\n📚 Related Books:');
  console.log('==================');
  
  finalResults.forEach((book, index) => {
    console.log(formatRelatedBook(book, index));
    
    // Add Amazon links if available
    if (book.id_amazon && book.id_amazon.length > 0) {
      console.log(`   🛒 Amazon: https://amazon.com/dp/${book.id_amazon[0]}`);
    }
    console.log('');
  });
  
  console.log('Legend:');
  console.log('⭐ = Average rating');
  console.log('👥 = Number of users who want to read');
  console.log('📖 = Has full text available');
  console.log('🌐 = Has public scan available');
  console.log('🛒 = Available on Amazon');
}

async function main(): Promise<void> {
  const workId = process.argv[2];
  
  if (!workId) {
    console.log('🔍 Related Books Finder');
    console.log('========================');
    console.log('Usage: npm run related-books "WORK_ID"');
    console.log('');
    console.log('Examples:');
    console.log('  npm run related-books "OL893415W"     # Find books related to Dune');
    console.log('  npm run related-books "/works/OL27448W" # Find books related to Lord of the Rings');
    console.log('');
    console.log('💡 Tip: Get work IDs from the main search script');
    console.log('');
    console.log('This tool finds related books using:');
    console.log('  📚 Books with similar subjects/themes');
    console.log('  👤 Other works by the same author(s)');
    console.log('  📈 Popular books in related categories');
    process.exit(1);
  }
  
  try {
    await findRelatedBooks(workId);
  } catch (error) {
    console.error('💥 Error finding related books:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
}); 