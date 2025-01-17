import { useData } from "vike-react/useData";
import TopNav from "../../../../components/TopNav";
import { ReturnedData } from "./+data";
import { usePageContext } from "vike-react/usePageContext";

const ComicPage = () => {
  const {comic} = useData<ReturnedData>();
  const pageContext = usePageContext()

  return(
    <>
      <TopNav currentPath={pageContext.urlParsed.pathname} />
      <div className="max-w-6xl container mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{comic.name}</h1>
            <p className="text-gray-600 mt-2">{comic.desc}</p>
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
              <h2 className="text-xl font-semibold mb-4">{chapter.title}</h2>
              
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