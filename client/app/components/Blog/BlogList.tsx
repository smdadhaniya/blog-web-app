"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { BlogForm } from "./AddBlog";
import Dialog from "../utils/common/dialog";
import Pagination from "../utils/common/pagination";
import axiosInstance from "@/config/axios-Instance";
import { formateDate } from "@/app/utils";
import { BlogResponse, IPost } from "./model/blog.model";

export const fetchBlogPosts = async (
  page: number,
  limit: number,
  search?: string
): Promise<BlogResponse> => {
  try {
    let params: Record<string, unknown> = {
      page,
      limit,
    };

    if (search) {
      params.search = search;
    }

    const response = await axiosInstance.get("/posts", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { data: [], totalCount: 0 };
  }
};

const BlogList = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isSubmitBlog, setIsSubmitBlog] = useState<boolean>(false);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;

  const debounceSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
    },
    [setSearchTerm]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchBlogPosts(
          currentPage,
          itemsPerPage,
          searchTerm
        );
        setPosts(response?.data || []);
        setTotalPosts(response?.totalCount || 0);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchTerm, isSubmitBlog]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    debounceSearch(searchTerm);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center px-4 pt-4 mb-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search for blog posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-[99%] p-3 mr-3 border rounded-md"
          />
        </div>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Add New Blog
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      ) : (
        !error &&
        !posts.length && (
          <div className="text-center py-4">
            <p className="text-black font-bold text-lg">{`Sorry, we couldn't find any blogs related to "${searchTerm}"!`}</p>
          </div>
        )
      )}

      {error && (
        <div className="text-center py-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow">
          {posts.map((post) => (
            <Link key={post?.id} href={`/blog/${post?.id}`}>
              <div className="flex flex-col h-[12vw] bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {post?.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    By {post?.author ?? "Unknown author"} -{" "}
                    {formateDate(post?.date ?? "")}
                  </p>
                  <p className="mt-4 text-gray-700">
                    {post?.content?.slice(0, 100)}...
                  </p>
                </div>
                <div className="p-4 mt-auto bg-gray-200 text-center text-sm text-black">
                  <span className="font-medium">Read More</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onClose={closeModal}>
        <BlogForm
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setIsSubmitBlog={setIsSubmitBlog}
          closeModal={closeModal}
        />
      </Dialog>

      <footer className="text-white py-4 absolute bottom-0 w-[98vw] mx-auto">
        <Pagination
          currentPage={currentPage}
          totalItems={totalPosts}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </footer>
    </div>
  );
};

export default BlogList;
