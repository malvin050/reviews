export const buildUrl = (url: string, pathParams: Record<string, string>) => {
  let redirectUrl = url;
  Object.keys(pathParams).forEach((key) => {
    redirectUrl = redirectUrl.replace(`:${key}`, pathParams[key]);
  });
  return redirectUrl;
};