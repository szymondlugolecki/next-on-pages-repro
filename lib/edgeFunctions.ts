export const authValidators = {
  email: (email: string) => {
    if (!email || email.length < 4) return 'Invalid email';
    return null;
  },
  nickname: (nickname: string) => {
    const invalid = nickname.length < 3 || nickname.length > 24;
    if (invalid) return 'Must be between 3 and 24 characters long';
    else return null;
  },
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
  // The maximum is exclusive and the minimum is inclusive
}

export const emailToNickname = (email: string) => {
  const emailPrefix = email.substring(0, email.indexOf('@'));
  console.log('emailPrefix', emailPrefix);

  // nickname = email with no prefix or numbers
  let nickname = emailPrefix.replace(/\d+/g, '');
  if (nickname.length > 19) nickname = emailPrefix.substring(0, 19);

  const nicknameID = getRandomInt(0, 9999);

  return `${nickname}-${nicknameID}`;
};

export const handleFaunaError = (error: any) => {
  const { code, description } = error.requestResult.responseContent.errors[0];
  let status;

  switch (code) {
    case 'unauthorized':
    case 'authentication failed':
      status = 401;
      break;
    case 'permission denied':
      status = 403;
      break;
    case 'instance not found':
      status = 404;
      break;
    case 'instance not unique':
    case 'contended transaction':
      status = 409;
      break;
    default:
      status = 500;
  }

  console.error(code, description);
  return { code, description, status };
};
