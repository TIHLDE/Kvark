type ValidatorResponse = {
  isValid: boolean;
  errorMessage: string;
};

const fileTypes = ['png', 'jpeg', 'jpg'];

async function validateFileSize(fileSize: number): Promise<ValidatorResponse> {
  const DocumentFileSizeValidator = (await import('../validators/DocumentFileSizeValidator')).default;

  const validator = new DocumentFileSizeValidator(fileSize);
  const isValid = validator.validateFileSize();

  return {
    isValid,
    errorMessage: isValid ? '' : validator.getErrorMessage(),
  };
}

async function validateFileType(fileType: string): Promise<ValidatorResponse> {
  const fileTypeValidator = (await import('../validators/FileTypeValidator')).default;
  console.log(fileType);
  const validator = new fileTypeValidator(fileType, fileTypes);
  const isValid = validator.validateFileType();

  return {
    isValid,
    errorMessage: isValid ? '' : validator.getErrorMessage(),
  };
}

export { validateFileSize, validateFileType };
