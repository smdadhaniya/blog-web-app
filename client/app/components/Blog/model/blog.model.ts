import { Dispatch, SetStateAction } from "react";

export interface IPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  date: string;
  comments?: IComment[];
}

export interface IComment {
  id?: string;
  author?: null;
  content?: string;
  date: string;
}

export interface BlogResponse {
  data: IPost[];
  totalCount: number;
}

export interface BlogFormProps {
  setIsSubmitBlog: Dispatch<SetStateAction<boolean>>;
  closeModal: () => void;
  currentPage: number;
  itemsPerPage: number;
}
