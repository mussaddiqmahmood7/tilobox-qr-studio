// Use type safe message keys with `next-intl`
type Messages = typeof import("./messages/en.json");
declare interface IntlMessages extends Messages {}

declare module "*.inline.jpg" {
  const content: string;
  export default content;
}

declare module "*.inline.png" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
