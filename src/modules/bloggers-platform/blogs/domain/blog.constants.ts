export const blogConstraints = {
  name: {
    minLength: 3,
    maxLength: 25,
  },
  description: {
    minLength: 1,
    maxLength: 500,
  },
  websiteUrl: {
    maxLength: 100,
  },
};
