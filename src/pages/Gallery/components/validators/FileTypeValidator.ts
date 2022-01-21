class FileTypeValidator {
  private fileType: string;
  private validTypes: string[];

  constructor(fileType: string, validTypes: string[]) {
    this.fileType = fileType;
    this.validTypes = validTypes;
  }

  validateFileType(): boolean {
    return this.validTypes.includes(this.fileType);
  }

  getErrorMessage(): string {
    return `${this.fileType} is not an accepted file type.`;
  }
}

export default FileTypeValidator;
