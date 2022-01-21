class DocumentFileSizeValidator {
  private fileSizeInBytes: number;
  private maxFileSizeInBytes = 20971520;

  constructor(fileSize: number) {
    this.fileSizeInBytes = fileSize;
  }

  validateFileSize(): boolean {
    return this.fileSizeInBytes <= this.maxFileSizeInBytes;
  }

  getErrorMessage(): string {
    return 'Maximum file size accepted is 20mb';
  }
}

export default DocumentFileSizeValidator;
