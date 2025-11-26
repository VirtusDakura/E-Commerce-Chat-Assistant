// Email utility - For now, logs to console
// TODO: Integrate with email service (nodemailer, SendGrid, etc.)

export const sendEmail = async (options) => {
  console.log('\n📧 Email Simulation - Password Reset');
  console.log('=====================================');
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message:\n${options.message}`);
  console.log('=====================================\n');

  // In production, you would send actual email here:
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({...});

  return true;
};
