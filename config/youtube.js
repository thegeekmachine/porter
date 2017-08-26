const credentials = {
  "installed": {
    "client_id": "227167769253-fe5s9impi8isqge88f4ko7kd9lolfeke.apps.googleusercontent.com",
    "project_id": "porter-175810",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "27zS2wtWY-KPlXzLRpP48UUB",
    "redirect_uris": [
      "http://localhost:8888/youtube/login"
    ]
  }
};

const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube'
];

let client_token = {
  "access_token":"ya29.GlunBOEYXkb2FxM6ppi3YdU_RQqMU40YJpi8El27yyKsR8Fdf03K1I7_SWsinQLtbvYaaFI0CcJe_EKkDzI8dTzFVo97yxrWKgpKGAkCtDglzriEjvVrqxDjJgdJ",
  "refresh_token":"1/Fa1jkYH8ECAfozUxTEPL0emeMVqUwRLWl5OotmAp1Js",
  "token_type":"Bearer",
  "expiry_date":1502731306295
};

let Oauth2Client;


module.exports = {
  credentials,
  scopes,
  client_token,
  Oauth2Client
}
