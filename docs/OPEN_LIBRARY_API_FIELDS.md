# Open Library API - Available Fields Documentation

This document lists all available fields from the Open Library Search API (`https://openlibrary.org/search.json`) discovered through field exploration.

## Currently Used Fields in Our Implementation
- ✅ `title` (string) - Book title
- ✅ `author_name` (array) - List of author names
- ✅ `first_publish_year` (number) - Year of first publication
- ✅ `key` (string) - OpenLibrary work ID (e.g., "/works/OL893415W")
- ✅ `edition_count` (number) - Number of different editions
- ✅ `has_fulltext` (boolean) - Whether full text is available
- ✅ `public_scan_b` (boolean) - Whether public scans are available

---

## All Available Fields

### 📊 Community & Popularity Data
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ratings_average` | number | Average user rating | 4.287958 |
| `ratings_count` | number | Total number of ratings | 382 |
| `ratings_count_1` | number | Number of 1-star ratings | 5 |
| `ratings_count_2` | number | Number of 2-star ratings | 13 |
| `ratings_count_3` | number | Number of 3-star ratings | 40 |
| `ratings_count_4` | number | Number of 4-star ratings | 133 |
| `ratings_count_5` | number | Number of 5-star ratings | 191 |
| `ratings_sortable` | number | Sortable rating score | 4.195803 |
| `readinglog_count` | number | Total reading log entries | 3620 |
| `already_read_count` | number | Users who marked as read | 599 |
| `currently_reading_count` | number | Users currently reading | 215 |
| `want_to_read_count` | number | Users who want to read | 2806 |

### 📈 Trending & Discovery
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `trending_score_daily_0` | number | Today's trending score | 43 |
| `trending_score_daily_1` | number | Yesterday's trending score | 132 |
| `trending_score_daily_2` | number | 2 days ago trending score | 81 |
| `trending_score_daily_3` | number | 3 days ago trending score | 56 |
| `trending_score_daily_4` | number | 4 days ago trending score | 37 |
| `trending_score_daily_5` | number | 5 days ago trending score | 56 |
| `trending_score_daily_6` | number | 6 days ago trending score | 14 |
| `trending_score_hourly_0` to `trending_score_hourly_23` | number | Hourly trending scores | 0-12 |
| `trending_score_hourly_sum` | number | Sum of hourly trending scores | 63 |
| `trending_z_score` | number | Normalized trending score | 0.08722322 |

### 📖 Publication & Physical Details
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `publisher` | array | List of publishers | ["Presse Poket", "Perigee Trade"] |
| `publisher_facet` | array | Publisher facets for filtering | ["AST", "Ace"] |
| `publish_date` | array | All publication dates | ["February 2009", "2021"] |
| `publish_year` | array | All publication years | [1965, 1966] |
| `publish_place` | array | Publication locations | ["München", "Philadelphia"] |
| `format` | array | Physical formats | ["Audio CD", "hardcover"] |
| `number_of_pages_median` | number | Median page count | 570 |
| `language` | array | Available languages (ISO codes) | ["spa", "fre"] |

### 👤 Author Information
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `author_key` | array | OpenLibrary author IDs | ["OL79034A"] |
| `author_name` | array | Author names | ["Frank Herbert"] |
| `author_alternative_name` | array | Alternative author names | ["フランク・ハーバート", "F. Herbert"] |
| `author_facet` | array | Author facets with IDs | ["OL79034A Frank Herbert"] |
| `contributor` | array | Contributors (narrators, etc.) | ["Connor O'Brien (Narrator)"] |

### 🏷️ Classification & Cataloging
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ddc` | array | Dewey Decimal Classifications | ["813.54", "813"] |
| `ddc_sort` | string | Primary DDC for sorting | "813.54" |
| `lcc` | array | Library of Congress Classifications | ["PS-3558.00000000.E63"] |
| `lcc_sort` | string | Primary LCC for sorting | "PS-3558.00000000.E63 D8 1965" |
| `lccn` | array | Library of Congress Control Numbers | ["83016030", "2006274831"] |
| `oclc` | array | OCLC WorldCat numbers | ["22440469", "931487572"] |

### 🌐 External Service Identifiers
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `isbn` | array | All ISBN numbers (10 & 13 digit) | ["9788401009129", "0426038916"] |
| `id_amazon` | array | Amazon product IDs | ["1435140745", "059309932X"] |
| `id_goodreads` | array | Goodreads book IDs | ["42430", "53788"] |
| `id_librarything` | array | LibraryThing IDs | ["4041453", "619509"] |
| `id_overdrive` | array | OverDrive library system IDs | ["3E43660B-C595-438A-8FC3-37B4414CD644"] |
| `id_dnb` | array | Deutsche Nationalbibliothek IDs | ["961720247"] |
| `id_isfdb` | array | Internet Speculative Fiction Database IDs | ["672794"] |

### 📚 Content & Subjects
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `subject` | array | Book subjects/topics | ["Dune (Imaginary place)", "Fiction"] |
| `subject_facet` | array | Subject facets for filtering | ["American Science fiction"] |
| `subject_key` | array | Subject keys for searching | ["american_literature", "american_science_fiction"] |
| `first_sentence` | array | Opening lines of the book | ["In the week before their departure to Arrakis..."] |
| `lexile` | array | Lexile reading level scores | ["800"] |

### 🎯 Digital Access & Availability
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ebook_access` | string | Type of ebook access | "borrowable" |
| `ebook_count_i` | number | Number of ebook editions | 15 |
| `ia` | array | Internet Archive identifiers | ["dune00herb_5", "illustrateddune00fran"] |
| `ia_box_id` | array | Internet Archive box IDs | ["IA141712", "IA107615"] |
| `ia_collection` | array | Internet Archive collections | ["California-State-Suggested-Reading"] |
| `ia_collection_s` | string | Collection string (semicolon-separated) | "California-State-Suggested-Reading;additional_coll" |
| `ia_loaded_id` | array | Loaded Internet Archive IDs | ["dune00herb"] |
| `lending_edition_s` | string | Lending edition ID | "OL26242482M" |
| `lending_identifier_s` | string | Lending identifier | "dune00herb_5" |
| `printdisabled_s` | string | Print-disabled accessible editions | "OL26242482M;OL7500941M" |

### 📑 Edition Information
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `edition_key` | array | All edition keys | ["OL59468619M", "OL33260759M"] |
| `cover_edition_key` | string | Edition key for the cover image | "OL32848840M" |
| `cover_i` | number | Cover image ID | 11481354 |

### 🔧 Technical & Metadata
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `type` | string | Object type | "work" |
| `_version_` | number | Search index version | 1838477152809386000 |
| `last_modified_i` | number | Last modification timestamp | 1751609234 |
| `seed` | array | Search seed values | ["/books/OL59468619M"] |
| `title_sort` | string | Title for sorting | "Dune" |
| `title_suggest` | string | Title for autocomplete | "Dune" |

---

## Usage Notes

### Getting All Fields
To retrieve all available fields, use the special `*` value:
```
https://openlibrary.org/search.json?q=dune&fields=*&limit=1
```

### Selective Field Retrieval
For better performance, request only needed fields:
```
https://openlibrary.org/search.json?q=dune&fields=title,author_name,isbn,publisher&limit=10
```

### Cover Images
Cover images can be accessed using the `cover_i` field:
```
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
```

### Author Images
Author images can be accessed using author keys from `author_key`:
```
https://covers.openlibrary.org/a/olid/{author_key}-M.jpg
```

---

*Last updated: January 2025*
*Generated from Open Library API field exploration* 