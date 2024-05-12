export const generateRandomCode = (length) => {
  // Ensure the length is within a valid range
  if (length <= 0 || length > 20) {
    throw new Error('Length must be between 1 and 20');
  }

  // Generate a random number with the specified length
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10); // Append a random digit (0-9)
  }
  return code;
};

/**
 * Escape unsafe characters.
 */
export function escapeRegexSpecialCharacters(string: string): string {
  return string.replace(/[<>*()?+]/g, '\\$&');
}

export function generateRoomName() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomName = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomName += characters.charAt(randomIndex);
  }

  return roomName;
}
