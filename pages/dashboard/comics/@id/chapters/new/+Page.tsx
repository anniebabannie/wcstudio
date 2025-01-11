import { useForm } from "react-hook-form";
import { ReturnedData } from "./+data";
import { useData } from "vike-react/useData";
import TopNav from "../../../../../../components/TopNav";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

const NewChapterPage = () => {
  const {comicId} = useData<ReturnedData>();
  const pageContext = usePageContext();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('comicId', comicId);
    formData.append('title', data.title);
    
    // Append each file to the FormData
    const files = data.pages;
    for (let i = 0; i < files.length; i++) {
      formData.append('pages', files[i]);
    }

    try {
      const response = await fetch('/comics/chapters/new', {
        method: 'POST',
        body: formData, // Don't set Content-Type header - browser will set it with boundary
      });
      const result = await response.json();
      console.log('Success:', result);
      throw navigate('/dashboard/comics/' + comicId);
    } catch (error) {
      console.error('Error:', error);
    }

  };

  return (
    <>
      <TopNav currentPath={pageContext.urlParsed.pathname} />
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Add New Chapter</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="hidden"
            {...register("comicId")}
            value={comicId}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Chapter Title</label>
            <input
          {...register("title", { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            />
            {errors.title && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pages</label>
            <input
          type="file"
          {...register("pages", { required: true })}
          multiple
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            />
            {errors.pages && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Chapter
          </button>
        </form>
      </div>
    </>
  );
}

export default NewChapterPage;