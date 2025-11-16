export const postConstraints = {
  title: {
    minLength: 3,
    maxLength: 15,
  },
  shortDescription: {
    minLength: 1,
    maxLength: 100,
  },
  content: {
    maxLength: 1000,
  },
  blogId: {
    maxLength: 100,
  },
};
