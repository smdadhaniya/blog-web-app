import * as Yup from "yup";
import { fetchBlogPosts } from "./BlogList";
import axiosInstance from "@/config/axios-Instance";
import { BlogFormProps, IPost } from "./model/blog.model";
import { Formik, Field, Form, ErrorMessage } from "formik";

const initialValues = {
  title: "",
  author: "",
  date: "",
  content: "",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title can't exceed 100 characters"),
  author: Yup.string()
    .required("Author is required")
    .max(50, "Author name can't exceed 50 characters"),
  date: Yup.string().required("Date is required"),
  content: Yup.string()
    .required("Content is required")
    .max(1000, "Content can't exceed 1000 characters"),
});

export const BlogForm = ({
  closeModal,
  setIsSubmitBlog,
  currentPage,
  itemsPerPage,
}: BlogFormProps) => {
  const handleSubmit = async (values: IPost) => {
    try {
      const response = await axiosInstance.post("/post", values);
      if (response.status === 201) {
        await fetchBlogPosts(currentPage, itemsPerPage);
        setIsSubmitBlog(true);
        closeModal();
      }
    } catch (error) {
      console.error("Error submitting blog post:", error);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form>
            <div className="grid grid-cols-2 gap-2">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-semibold">
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-semibold">
                  Author
                </label>
                <Field
                  type="text"
                  id="author"
                  name="author"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="author"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-semibold"
                >
                  Content
                </label>
                <Field
                  as="textarea"
                  id="content"
                  name="content"
                  className="w-full p-2 border rounded-md"
                  rows={6}
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-semibold">
                  Date
                </label>
                <Field
                  type="date"
                  id="date"
                  name="date"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end items-center">
              <button
                type="submit"
                disabled={!isValid}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
