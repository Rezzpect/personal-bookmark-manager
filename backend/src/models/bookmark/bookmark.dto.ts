export class CreateBookmarkDto {
  url: string;
  title: string;
  notes?: string;
  collectionId?: string | null;
  ownerId: string;
}

export class UpdateBookmarkDto {
  url?: string;
  title?: string;
  notes?: string;
  collectionId?: string | null;
  ownerId?: string;
}
