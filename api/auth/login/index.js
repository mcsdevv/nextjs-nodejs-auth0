const cookie = require('cookie');
const uuidv4 = require('uuid/v4');
const cookieOptions = require('../../_util/cookie/options');

module.exports = async (req, res) => {
  // generate random opaque value for state
  const state = uuidv4();
  // add state as httpOnly cookie for callback to check
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('state', String(state), cookieOptions(true))
  );
  // write redirect
  res.writeHead(302, {
    Location: `https://${
      process.env.AUTH0_DOMAIN
    }/authorize?response_type=code&audience=${
      process.env.AUTH0_AUDIENCE
    }&client_id=${process.env.AUTH0_CLIENT_ID}&redirect_uri=${
      process.env.AUTH0_REDIRECT_URI
    }/api/auth/callback/&scope=openid%20profile%20email&state=${state}`
  });
  // send response
  res.end();
};
