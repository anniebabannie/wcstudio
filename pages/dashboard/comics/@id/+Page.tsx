import { useData } from "vike-react/useData";
import TopNav from "../../../../components/TopNav";
import { ReturnedData } from "./+data";
import { usePageContext } from "vike-react/usePageContext";
import { reload } from "vike/client/router";

const ComicPage = () => {
  const {comic} = useData<ReturnedData>();
  const pageContext = usePageContext()

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) {
      return;
    }

    try {
      console.log('Attempting to delete chapter:', chapterId);  // Debug log
      const response = await fetch(`/chapters/${chapterId}`, {
        method: 'DELETE',
      });
      
      // Log the actual response for debugging
      console.log('Delete response status:', response.status);
      const responseData = await response.text();
      console.log('Delete response body:', responseData);

      if (response.ok) {
        reload(); // Refresh the page to show updated data
      } else {
        console.error('Failed to delete chapter:', response.status, responseData);
      }
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  return(
    <>
      <TopNav currentPath={pageContext.urlParsed.pathname} />
      <div className="max-w-6xl container mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{comic.name}</h1>
            <p className="text-gray-600 mt-2">{comic.desc}</p>
            <p><a href={`http://${comic.slug}.wcs.local:3000`}>{comic.slug}.wcs.local:3000</a></p>
          </div>
          <a
            href={`/dashboard/comics/${comic.id}/chapters/new`}
            className="inline-block px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
          >
            + Add a chapter
          </a>
        </div>

        <div className="space-y-12">
          {comic.chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{chapter.title}</h2>
                <button
                  onClick={() => handleDeleteChapter(chapter.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete Chapter
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {chapter.pages.map((page) => (
                  <div key={page.id} className="aspect-w-2 aspect-h-3">
                    <img
                      src={page.img}
                      alt={`Page ${page.pageNo}`}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ComicPage;