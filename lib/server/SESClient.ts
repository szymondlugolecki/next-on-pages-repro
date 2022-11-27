import * as AWS from '@aws-sdk/client-ses';

const client = new AWS.SES({
  region: 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const sendLoginEmail = ({
  userEmail,
  verificationID,
}: {
  userEmail: string;
  verificationID: string;
}) =>
  client.sendEmail({
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Subject: {
        Data: 'Login to geopolis',
      },
      Body: {
        Html: {
          Data: `<span>Hello this is your verification ID ${verificationID}</span>`,
        },
      },
    },
    Source: 'Login <no-reply@geopolis.io>',
  });

const sendHackerWarning = ({ userEmail }: { userEmail: string }) =>
  client.sendEmail({
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Subject: {
        Data: 'Someone tried to access your account',
      },
      Body: {
        Html: {
          Data: '<span>Warning! This is an automated message</span>',
        },
      },
    },
    Source: 'Warning <no-reply@geopolis.io>',
  });

export { sendLoginEmail, sendHackerWarning };
