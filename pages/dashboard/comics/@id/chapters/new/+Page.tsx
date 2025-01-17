import { useForm } from "react-hook-form";
import { ReturnedData } from "./+data";
import { useData } from "vike-react/useData";
import TopNav from "../../../../../../components/TopNav";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

const NewChapterPage = () => {
  const {comicId} = useData<ReturnedData>();
  const pageContext = usePageContext();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(uploadedFiles);
    const previewItems = Array.from(previews);
    const [reorderedFile] = items.splice(result.source.index, 1);
    const [reorderedPreview] = previewItems.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedFile);
    previewItems.splice(result.destination.index, 0, reorderedPreview);

    setUploadedFiles(items);
    setPreviews(previewItems);
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('comicId', comicId);
    formData.append('title', data.title);
    
    // Append files in their current order
    uploadedFiles.forEach((file, index) => {
      formData.append(`pages`, file);
      formData.append('positions', index.toString());
    });

    try {
      const response = await fetch('/comics/chapters/new', {
        method: 'POST',
        body: formData,
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
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            />
          </div>

          {previews.length > 0 && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pageList">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {previews.map((preview, index) => (
                      <Draggable key={preview} draggableId={preview} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-2 bg-gray-100 rounded flex items-center"
                          >
                            <img 
                              src={preview} 
                              alt={`Page ${index + 1}`} 
                              className="w-20 h-20 object-cover rounded"
                            />
                            <span className="ml-2">Page {index + 1}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          <button 
            type="submit" 
            disabled={uploadedFiles.length === 0}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            Add Chapter
          </button>
        </form>
      </div>
    </>
  );
}

export default NewChapterPage;