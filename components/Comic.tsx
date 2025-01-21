import { Chapter, Comic as ComicType, Page } from '@prisma/client';

interface ComicProps {
  comic: ComicType & {
    chapters: (Chapter & {
      pages: (Page & {
        position: number;
      })[];
    })[];
  };
}

function Comic({ comic }: ComicProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-6">
        <a href="/"><h1 className="text-2xl font-bold mb-4">{comic.name}</h1></a>
        <p className="text-gray-700">{comic.desc}</p>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex flex-col h-full">
          {/* Top Navigation */}
          <NavigationButtons comic={comic} />

          {/* Comic Page */}
          <a href={`/${comic.chapters?.[0]?.id}/${comic.chapters?.[0]?.pages?.[0]?.position + 1}`} className="flex-1">
            {comic.chapters?.[0]?.pages?.[0]?.img ? (
              <img 
                src={comic.chapters[0].pages[0].img} 
                alt="First page"
                className="h-screen object-contain"
              />
            ) : (
              <p className="text-gray-500">No pages available</p>
            )}
          </a>

          {/* Bottom Navigation */}
          <NavigationButtons comic={comic} />
        </div>
      </div>
    </div>
  );
}

// ... existing code ...

const NavigationButtons = ({ comic }: ComicProps) => {
  // Get current chapter and page
  const currentChapter = comic.chapters?.[0];
  const currentPage = currentChapter?.pages?.[0];
  
  // Find next chapter if we're on the last page
  const isLastPage = currentPage?.position === currentChapter?.pages?.length - 1;
  const nextChapterIndex = comic.chapters?.findIndex(c => c.id === currentChapter?.id) + 1;
  const nextChapter = comic.chapters?.[nextChapterIndex];

  // Determine next URL based on whether we're at the last page
  const nextUrl = isLastPage && nextChapter
    ? `/${nextChapter.id}/${0}` // First page of next chapter
    : `/${currentChapter?.id}/${(currentPage?.position) + 1}`; // Next page in current chapter

  return (
    <div className="flex justify-between">
      <a 
        href={`/${currentChapter?.id}/${(currentPage?.position) - 1}`}
        className={`px-4 py-2 rounded-lg ${currentPage?.position === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        onClick={e => {if (currentPage?.position === 0) e.preventDefault()}}
      >
        Previous
      </a>
      <a
        href={nextUrl}
        className={`px-4 py-2 rounded-lg ${isLastPage && !nextChapter ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        onClick={e => {if (isLastPage && !nextChapter) e.preventDefault()}}
      >
        Next
      </a>
    </div>
  );
};


export default Comic;
