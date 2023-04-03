export interface Image {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  lastRequest?: Date;
  deletedOn?: Date | null;
  title: string;
  description: string;
  userId?: string,
  imageUrl: string,
  author: string,
  raiting?: number,
}
