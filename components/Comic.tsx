import { Comic as ComicType } from '@prisma/client';

interface ComicProps {
  comic: ComicType;
}

function Comic({ comic }: ComicProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">{comic.name}</h1>
        <p className="text-gray-700">{comic.desc}</p>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex flex-col h-full">
          {/* Top Navigation */}
          <div className="flex justify-between mb-4">
            <button className="px-4 py-2 bg-gray-200 rounded-lg" disabled>Previous</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">Next</button>
          </div>

          {/* Comic Page */}
          <a href={`/${comic.chapters?.[0]?.id}/1`} className="flex-1">
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
          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 bg-gray-200 rounded-lg" disabled>Previous</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comic;
