import { signInEmail } from './constants/emails';

const myHeaders = new Headers();

const username = process.env.MAILJET_PUBLIC_KEY || '';
const password = process.env.MAILJET_PRIVATE_KEY || '';

myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Authorization', `Basic ${btoa(username + ':' + password)} `);

interface RawEmailProps {
  author: { email: string; name: string };
  receiver: { email: string; name: string };
  subject: string;
  html: string;
}

const noReplyAuthor = {
  email: 'no-reply@geopolis.io',
  name: 'geopolis.io',
};

const rawEmail = ({ author, receiver, subject, html }: RawEmailProps) =>
  JSON.stringify({
    Messages: [
      {
        From: {
          Email: author.email,
          Name: author.name,
        },
        To: [
          {
            Email: receiver.email,
            Name: receiver.name,
          },
        ],
        Subject: subject,
        TextPart: 'Greetings from geopolis.io!',
        HTMLPart: html,
      },
    ],
  });

const sendLoginEmail = async ({
  userEmail,
  verificationID,
}: {
  userEmail: string;
  verificationID: string;
}) => {
  if (!userEmail) throw new Error('Invalid email');
  if (!verificationID) throw new Error('Invalid verification Id');
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: rawEmail({
      author: noReplyAuthor,
      html: signInEmail(`${process.env.NEXTAUTH_URL}/auth/verification/${verificationID}`),
      receiver: { email: userEmail, name: 'You' },
      subject: 'Login to geopolis.io',
    }),
    redirect: 'follow',
  };

  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', requestOptions);
    const data = await response.json();
    console.log('Email sent', data);
  } catch (error) {
    throw new Error('Error while sending an email');
  }
};

// client.sendEmail({
//   Destination: {
//     ToAddresses: [userEmail],
//   },
//   Message: {
//     Subject: {
//       Data: 'Login to geopolis',
//     },
//     Body: {
//       Html: {
//         Data: `<span>Hello this is your verification ID ${verificationID}</span>`,
//       },
//     },
//   },
//   Source: 'Login <no-reply@geopolis.io>',
// });

// const sendHackerWarning = ({ userEmail }: { userEmail: string }) =>
//   client.sendEmail({
//     Destination: {
//       ToAddresses: [userEmail],
//     },
//     Message: {
//       Subject: {
//         Data: 'Someone tried to access your account',
//       },
//       Body: {
//         Html: {
//           Data: '<span>Warning! This is an automated message</span>',
//         },
//       },
//     },
//     Source: 'Warning <no-reply@geopolis.io>',
//   });

export { sendLoginEmail };
