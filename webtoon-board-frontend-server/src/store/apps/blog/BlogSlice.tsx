import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../Store";

interface StateType {
  blogposts: any[];
  recentPosts: any[];
  blogSearch: string;
  sortBy: string;
  selectedPost: any;
}

const initialState = {
  blogposts: [],
  recentPosts: [],
  blogSearch: "",
  sortBy: "newest",
  selectedPost: null,
};

export const BlogSlice = createSlice({
  name: "Blog",
  initialState,
  reducers: {
    getPosts: (state: StateType, action) => {
      state.blogposts = action.payload;
    },
    getPost: (state: StateType, action) => {
      state.selectedPost = action.payload;
    },
  },
});

export const { getPost } = BlogSlice.actions;
export const fetchBlogPost =
  (title: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post("/api/data/blog/post", { title });
      dispatch(getPost(response.data.post));
    } catch (err: any) {
      throw new Error(err);
    }
  };
export default BlogSlice.reducer;
