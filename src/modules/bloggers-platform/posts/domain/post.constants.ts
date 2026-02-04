export const postConstraints = {
  title: {
    minLength: 3,
    maxLength: 55,
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
