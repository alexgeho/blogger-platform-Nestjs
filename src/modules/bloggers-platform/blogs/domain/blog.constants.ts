export const blogConstraints = {
  name: {
    minLength: 3,
    maxLength: 15,
  },
  description: {
    minLength: 1,
    maxLength: 500,
  },
  websiteUrl: {
    maxLength: 100,
  },
};
