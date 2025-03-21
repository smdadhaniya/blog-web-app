import dynamic from "next/dynamic";

const BlogPost = dynamic(() => import("@/app/components/Blog/BlogPost"));
export default BlogPost;
