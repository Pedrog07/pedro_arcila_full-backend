export interface RenameFileDTO {
  fileId: string;
  newName: string;
}

export interface SearchExternalFilesDTO {
  search: string;
  page: number;
  perPage: number;
}
