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
      <div className="max-w-4xl container mx-auto py-12">
        <h1>{comic.name}</h1>
        <p>{comic.desc}</p>
        <a
          href={`/dashboard/comics/${comic.id}/chapters/new`}
          className="mt-4 inline-block px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
        >
          + Add a chapter
        </a>
      </div>
    </>
  )
}

export default ComicPage;