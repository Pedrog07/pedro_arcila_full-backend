export interface RenameFileDTO {
  fileId: string;
  newName: string;
}

export interface SearchExternalFilesDTO {
  search: string;
  page: number;
  perPage: number;
}

export interface SaveExternalFilesDTO {
  photoId: string;
  fileName: string;
}
