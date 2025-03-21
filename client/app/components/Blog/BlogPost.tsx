"use client";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import axiosInstance from "@/config/axios-Instance";
import { formateDate, getIdFromPath } from "@/app/utils";
import { IComment, IPost } from "./model/blog.model";

const validationSchema = Yup.object({
  comment: Yup.string()
    .required("Comment is required")
    .min(5, "Comment must be at least 5 characters"),
});

const BlogPost = () => {
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blogId, setBlogId] = useState<string | null>(null);

  const fetchComments = async (id: string) => {
    try {
      const commentsResponse = await axiosInstance.get(`/post/${id}/comments`);
      setComments(commentsResponse.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Failed to fetch comments.");
    }
  };

  useEffect(() => {
    const id = getIdFromPath();
    if (id) {
      setBlogId(id);
      const fetchPostData = async () => {
        try {
          const postResponse = await axiosInstance.get(`/post/${id}`);
          setPost(postResponse.data);
          await fetchComments(id);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch post data.");
          setLoading(false);
        }
      };
      fetchPostData();
    } else {
      setError("Invalid post ID.");
      setLoading(false);
    }
  }, []);

  const handleCommentSubmit = async (
    values: { comment: string },
    formikHelpers: FormikHelpers<{ comment: string }>
  ) => {
    if (!blogId || !post?.author) {
      setError("Post or blog ID is missing.");
      return;
    }

    try {
      await axiosInstance.post(`/post/${blogId}/comment`, {
        content: values.comment,
        author: post?.author,
      });
      await fetchComments(blogId);
      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!post) {
    return <p className="text-center text-red-500">Post not found!</p>;
  }

  return (
    <div className="container p-2">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500">
        By {post.author ?? "Unknown author"} - {formateDate(post.date ?? "")}
      </p>
      <div className="mt-6">
        <p className="text-gray-700">{post.content}</p>
      </div>
      <div className="mt-10 border-t pt-4">
        <h2 className="text-2xl font-semibold mb-2">Add a Comment</h2>
        <Formik
          initialValues={{ comment: "" }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleCommentSubmit}
        >
          <Form>
            <div className="flex flex-col mb-4">
              <Field
                id="comment-input"
                as="textarea"
                name="comment"
                className="w-full p-2 border rounded-lg"
                placeholder="Write your comment here..."
              />
              <ErrorMessage
                name="comment"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <div className="mt-10 border-t pt-4">
        <h2 className="text-2xl font-semibold mb-2">Comments</h2>
        {!comments.length ? (
          <p className="text-gray-500">No comments Found!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="mt-4 p-4 border rounded bg-white">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">{comment?.content}</p>
                <p className="text-sm text-gray-500">
                  {comment?.date
                    ? formateDate(comment?.date)
                    : "Date not available"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogPost;
