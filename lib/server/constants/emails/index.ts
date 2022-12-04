export const signInEmail = (verificationLink: string) => {
  console.log('verificationLink', verificationLink);
  return `    <table style="background: #0f0f0f; border-radius: 1rem; text-align: center; padding: 20px 15px; width: 100%;">
  <tbody style="font-family: Helvetica, Arial, sans-serif">
    <tr>
      <td
        style="text-decoration: none; color: white; font-size: xx-large; padding-bottom: 30px"
      >
        Sign in to geopolis.io
      </td>
    </tr>
    <tr>
      <td style="text-decoration: none; color: white; padding-bottom: 30px">
        <a
          href="${verificationLink}"
          style="
            background: #40c057;
            color: white;
            font-size: x-large;
            padding: 10px 20px;
            text-align: center;
            border: 0;
            border-radius: 10px;
            font-weight: bolder;
            text-decoration: none;
          "
          >Sign in</a
        >
      </td>
    </tr>
    <tr>
      <td style="text-decoration: none; color: white">You can also click this link</td>
    </tr>
    <tr>
      <td style="text-decoration: none; padding-bottom: 30px">
        <a href="${verificationLink}" style="color: #fab005">${verificationLink}</a>
      </td>
    </tr>
    <tr>
      <td style="text-decoration: none; color: white">
        If you didn't request this email you can safely ignore it
      </td>
    </tr>
  </tbody>
</table>`;
};
