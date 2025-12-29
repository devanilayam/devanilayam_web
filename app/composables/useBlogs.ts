export const useBlogs = (): IUseBlogs => {

   const { locale } = useLocale();

   const listOfBlogs = ref<Blog[]>([]);

   const getListOfBlogs = async (): Promise<Blog[]> => {

      const blogs = await queryCollection("blogs")
         .where("lang", "=", locale.value)
         .all();

      listOfBlogs.value = blogs?.map((l) => ({
         blog_id: l.blog_id,
         title: l.title,
         description: l.description,
         lang: l.lang,
         author: l.author,
         tags: l.tags,
         excerpt: l.excerpt,
         date: l.date,
      }));

      return listOfBlogs.value;

   };

   const getBlogById = async (blog_id: string): Promise<Blog | null> => {

      const blog = await queryCollection("blogs")
         .where("lang", "=", locale.value)
         .where("blog_id", "=", blog_id)
         .first();

      if (!blog) {

         return null;

      }

      return blog;

   };

   return {
      listOfBlogs,
      getListOfBlogs,
      getBlogById,
   };

};

export interface Blog {
   blog_id: string;
   title: string;
   description: string;
   lang: string;
   author?: string;
   tags?: string[];
   excerpt?: object;
   date: string;
}

interface IUseBlogs {
   listOfBlogs: Ref<Blog[]>;
   getListOfBlogs: () => Promise<Blog[]>;
   getBlogById: (blog_id: string) => Promise<Blog | null>;
}
