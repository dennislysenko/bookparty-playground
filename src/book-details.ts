import axios from 'axios';

interface WorkDetails {
  title: string;
  description?: string;
  covers?: number[];
  key: string;
  authors?: Array<{
    author?: {
      key: string;
    };
    type?: {
      key: string;
    };
  }>;
  subjects?: string[];
  links?: Array<{
    title: string;
    url: string;
  }>;
  created?: {
    type: string;
    value: string;
  };
  last_modified?: {
    type: string;
    value: string;
  };
  latest_revision?: number;
  revision?: number;
  type: {
    key: string;
  };
}

interface AuthorDetails {
  name: string;
  key: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { type: string; value: string };
}

async function fetchAuthorDetails(authorKey: string): Promise<AuthorDetails | null> {
  try {
    const response = await axios.get<AuthorDetails>(`https://openlibrary.org${authorKey}.json`);
    return response.data;
  } catch (error) {
    console.warn(`⚠️  Could not fetch author details for ${authorKey}`);
    return null;
  }
}

async function fetchWorkDetails(workId: string): Promise<WorkDetails | null> {
  try {
    // Ensure workId starts with /works/ if it doesn't already
    const workKey = workId.startsWith('/works/') ? workId : `/works/${workId}`;
    
    console.log(`🔍 Fetching details for: ${workKey}`);
    
    const response = await axios.get<WorkDetails>(`https://openlibrary.org${workKey}.json`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.error(`❌ Work not found: ${workId}`);
      } else {
        console.error(`❌ API Error: ${error.response?.status} ${error.response?.statusText}`);
      }
    } else {
      console.error(`❌ Unexpected Error: ${error}`);
    }
    return null;
  }
}

function formatDescription(description: string): string {
  // Clean up the description text
  return description
    .replace(/\n\n/g, '\n\n   ') // Indent paragraphs
    .replace(/^/, '   '); // Indent first line
}

function formatDate(dateObj: { type: string; value: string } | undefined): string {
  if (!dateObj) return 'Unknown';
  const date = new Date(dateObj.value);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

async function displayWorkDetails(work: WorkDetails): Promise<void> {
  console.log('\n📚 Book Details');
  console.log('===============');
  
  console.log(`📖 Title: ${work.title}`);
  console.log(`🆔 OpenLibrary ID: ${work.key}`);
  
  // Fetch and display author information
  if (work.authors && work.authors.length > 0) {
    console.log('\n👤 Authors:');
    for (const authorRef of work.authors) {
      if (authorRef.author?.key) {
        const authorDetails = await fetchAuthorDetails(authorRef.author.key);
        if (authorDetails) {
          const bio = typeof authorDetails.bio === 'string' 
            ? authorDetails.bio 
            : authorDetails.bio?.value || '';
          const dates = authorDetails.birth_date 
            ? `(${authorDetails.birth_date}${authorDetails.death_date ? ` - ${authorDetails.death_date}` : ''})`
            : '';
          
          console.log(`   • ${authorDetails.name} ${dates}`);
          console.log(`     🆔 ${authorDetails.key}`);
          if (bio && bio.length > 0) {
            const shortBio = bio.length > 200 ? bio.slice(0, 200) + '...' : bio;
            console.log(`     📝 ${shortBio}`);
          }
        }
      }
    }
  }
  
  // Display synopsis/description
  if (work.description) {
    console.log('\n📄 Synopsis:');
    console.log(formatDescription(work.description));
  } else {
    console.log('\n📄 Synopsis: Not available');
  }
  
  // Display subjects
  if (work.subjects && work.subjects.length > 0) {
    console.log('\n🏷️  Subjects:');
    work.subjects.slice(0, 10).forEach(subject => {
      console.log(`   • ${subject}`);
    });
    if (work.subjects.length > 10) {
      console.log(`   ... and ${work.subjects.length - 10} more`);
    }
  }
  
  // Display external links
  if (work.links && work.links.length > 0) {
    console.log('\n🔗 External Links:');
    work.links.forEach(link => {
      console.log(`   • ${link.title}: ${link.url}`);
    });
  }
  
  // Display cover information
  if (work.covers && work.covers.length > 0) {
    console.log('\n🖼️  Cover Images:');
    work.covers.slice(0, 3).forEach((coverId, index) => {
      console.log(`   ${index + 1}. https://covers.openlibrary.org/b/id/${coverId}-L.jpg`);
    });
  }
  
  // Display metadata
  console.log('\n📊 Metadata:');
  console.log(`   Created: ${formatDate(work.created)}`);
  console.log(`   Last Modified: ${formatDate(work.last_modified)}`);
  console.log(`   Revision: ${work.revision}${work.latest_revision ? ` (latest: ${work.latest_revision})` : ''}`);
}

async function main(): Promise<void> {
  const workId = process.argv[2];
  
  if (!workId) {
    console.log('📚 Book Details Fetcher');
    console.log('=======================');
    console.log('Usage: npm run book-details "WORK_ID"');
    console.log('       npm run dev:details "WORK_ID"');
    console.log('');
    console.log('Examples:');
    console.log('  npm run book-details "OL893415W"');
    console.log('  npm run book-details "/works/OL893415W"');
    console.log('  npm run book-details "OL27448W"    # Lord of the Rings');
    console.log('');
    console.log('💡 Tip: Get work IDs from the main search script');
    process.exit(1);
  }
  
  try {
    const work = await fetchWorkDetails(workId);
    if (work) {
      await displayWorkDetails(work);
    }
  } catch (error) {
    console.error('💥 Error fetching work details:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
}); 