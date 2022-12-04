// Hooks
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';

// Components
import { Avatar, Divider, Group, Paper, Title, Text } from '@mantine/core';
import Loading from '../../components/Layout/Loading';

// Types
import type { NicknameChangeForm } from '../../types/ComponentProps';

import { formValidators } from '../../lib/edgeFunctions';
import NameChanger from '../../components/NameChanger';
import { useAuth } from '../../lib/swrClient';
import { useEffect } from 'react';

// Styles

const SettingsDivider = () => <Divider my='md' />;
const SettingsGroup = ({ children }: { children: JSX.Element[] | JSX.Element }) => (
  <Group position='apart' px='sm'>
    {children}
  </Group>
);
const SettingsSectionTitle = ({ title }: { title: string }) => <Title order={3}>{title}</Title>;

export default function SettingsPage() {
  const { push } = useRouter();
  const { useSession } = useAuth();
  const { status, data: sessionData } = useSession();

  const form = useForm<NicknameChangeForm>({
    initialValues: {
      nickname: sessionData?.user.nickname || '',
      available: false,
      availableList: [],
      unavailableList: sessionData?.user ? [sessionData?.user.nickname] : [],
      loading: false,
    },
    validate: {
      nickname: formValidators.nickname,
    },
  });

  useEffect(() => {
    console.log('status', status);
    if (status === 'unauthenticated' && push) push('/auth/login');
  }, [status, push]);

  useEffect(() => {
    if (sessionData?.user.nickname) {
      if (!form.values.nickname) {
        form.setFieldValue('nickname', sessionData.user.nickname);
      }
      if (!form.values.unavailableList.includes(form.values.nickname)) {
        form.insertListItem('unavailableList', sessionData.user.nickname);
      }
    }
  }, [sessionData, form]);

  if (status !== 'authenticated') return <Loading />;

  return (
    <Paper withBorder p='md'>
      <SettingsGroup>
        <SettingsSectionTitle title='Avatar' />
        <Avatar src={sessionData.user.avatar} alt='Your profile picture' size={200} radius='xl' />
      </SettingsGroup>

      <SettingsDivider />

      <SettingsGroup>
        <SettingsSectionTitle title='Name Changes' />
        <Text>{sessionData.user.nameChanges}</Text>
      </SettingsGroup>

      <SettingsDivider />

      <SettingsGroup>
        <SettingsSectionTitle title='Nickname' />
        <NameChanger form={form} user={sessionData.user} />
      </SettingsGroup>

      <SettingsDivider />
    </Paper>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const tokenHeader = req.headers.authorization;

//   if (!tokenHeader) {
//     res.statusCode = 401;
//     throw new Error('Authorization token not found');
//   }

//   const tokenSplit = tokenHeader.split(' ');
//   const token = tokenSplit[1];
//   if (!token) {
//     res.statusCode = 401;
//     throw new Error('Invalid authorization token');
//   }

//   const { payload } = await verifyToken(token);

//   const { user } = payload as JWTPayload & { user: User };

//   // Check the database
//   try {
//     const userQuery = await client.user.findFirstOrThrow({
//       where: {
//         email: user.email,
//       },
//     });

//     console.log('userQuery', userQuery);

//     const { createdAt, banned, nickname, vip, email, nameChanges, avatar } = userQuery;

//     return {
//       props: {
//         user: {
//           createdAt,
//           banned,
//           nickname,
//           vip,
//           email,
//           nameChanges,
//           avatar,
//         },
//       },
//     };
//   } catch (error: any) {
//     if (error.code === 'ERR_JWT_EXPIRED') {
//       throw new Error('Authorization token expired');
//     }
//     handlePrismaError(error);
//     throw new Error('Unexpected error');
//   }
// };
