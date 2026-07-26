export class CreateCollectionDto {
  name: string;
  ownerId: string;
}

export class UpdateCollectionDto {
  name?: string;
  ownerId?: string;
}
