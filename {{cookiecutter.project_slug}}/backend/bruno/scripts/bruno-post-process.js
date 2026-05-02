const fs = require('fs');
const path = require('path');

const openapiSampler = require('openapi-sampler');

const openapiPath = path.join(__dirname, '../../api/openapi.json');
const collectionPath = path.join(__dirname, '../../bruno-collection');
const envPath = path.join(collectionPath, 'environments/Local.bru');

if (!fs.existsSync(openapiPath)) {
  console.error('OpenAPI spec not found at', openapiPath);
  process.exit(1);
}

const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.bru')) {
      files.push(name);
    }
  }
  return files;
}

const bruFiles = getFiles(collectionPath);

for (const bruFile of bruFiles) {
  let content = fs.readFileSync(bruFile, 'utf8');

  // 1. Replace {{baseUrl}} with {{url}}
  content = content.replace(/\{\{baseUrl\}\}/g, '{{url}}');

  // 2. Find the operation in OpenAPI to get dummy data
  const methodMatch = content.match(/^(get|post|put|delete|patch)\s*\{/m);
  const urlMatch = content.match(/url:\s*(?:\{\{url\}\})?(.*?)\n/);

  if (methodMatch && urlMatch) {
    const method = methodMatch[1].toLowerCase();
    const urlPath = urlMatch[1].trim().split('?')[0];

    // Find matching path in openapi
    const openapiPathKey = Object.keys(openapi.paths).find(pk => {
      const cleanPk = pk.replace(/\{.*?\}/g, '[^/]+');
      const regex = new RegExp('^' + cleanPk + '$');
      return regex.test(urlPath);
    });

    if (openapiPathKey && openapi.paths[openapiPathKey][method]) {
      const op = openapi.paths[openapiPathKey][method];
      if (op.requestBody && op.requestBody.content && op.requestBody.content['application/json']) {
        const schema = op.requestBody.content['application/json'].schema;
        const sample = openapiSampler.sample(schema, { skipReadOnly: true }, openapi);

        if (sample) {
          const sampleStr = JSON.stringify(sample, null, 2);
          // Replace body:json block
          const bodyRegex = /body:json\s*\{[\s\S]*?\n\}/;
          if (content.match(bodyRegex)) {
            content = content.replace(bodyRegex, `body:json {\n${sampleStr.split('\n').map(l => '  ' + l).join('\n')}\n}`);
            console.log(`Updated body for ${method.toUpperCase()} ${urlPath}`);
          }
        }
      }
    }
  }

  fs.writeFileSync(bruFile, content);
}

// 3. Rename folders to Camel Case (Title Case with spaces) and drop -controller suffix
function toCamelCase(str) {
  return str
    .replace('-controller', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const dirs = fs.readdirSync(collectionPath).filter(f => fs.statSync(path.join(collectionPath, f)).isDirectory() && f !== 'environments');

for (const dir of dirs) {
  const oldPath = path.join(collectionPath, dir);
  const newName = toCamelCase(dir);
  const newPath = path.join(collectionPath, newName);

  // Update folder.bru if it exists
  const folderBruPath = path.join(oldPath, 'folder.bru');
  if (fs.existsSync(folderBruPath)) {
    let folderContent = fs.readFileSync(folderBruPath, 'utf8');
    folderContent = folderContent.replace(/name: .*/, `name: ${newName}`);
    fs.writeFileSync(folderBruPath, folderContent);
  }

  if (oldPath !== newPath) {
    if (fs.existsSync(newPath)) {
      // If target exists, move files and delete old (handle collisions if any)
      const files = fs.readdirSync(oldPath);
      for (const file of files) {
        fs.renameSync(path.join(oldPath, file), path.join(newPath, file));
      }
      fs.rmdirSync(oldPath);
    } else {
      fs.renameSync(oldPath, newPath);
    }
    console.log(`Renamed folder ${dir} to ${newName}`);
  }
}

// 4. Create Environment file
const envContent = `vars {
  cognito_client_secret: ${process.env.COGNITO_CLIENT_SECRET || ''}
  cognito_client_id: ${process.env.COGNITO_CLIENT_ID || ''}
  cognito_url: ${process.env.COGNITO_URL || ''}
  cognito_redirect_url: ${process.env.COGNITO_REDIRECT_URL || ''}
  url: ${process.env.URL || ''}
  active_tenant_id: ${process.env.ACTIVE_TENANT_ID || ''}
  tenant_id: ${process.env.TENANT_ID || ''}
}
`;

if (!fs.existsSync(path.dirname(envPath))) {
  fs.mkdirSync(path.dirname(envPath), { recursive: true });
}
fs.writeFileSync(envPath, envContent);

// 5. Update collection.bru for OAuth2
const collectionBruPath = path.join(collectionPath, 'collection.bru');
if (fs.existsSync(collectionBruPath)) {
  const collectionBruContent = `meta {
  name: {{cookiecutter.project_name}} API
}
{% raw %}

headers {
  X-Iaas-Token: {{$oauth2.credentials.id_token}}
  X-TENANT-ID: {{active_tenant_id}}
}

auth {
  mode: oauth2
}

auth:oauth2 {
  grant_type: authorization_code
  callback_url: {{cognito_redirect_url}}
  authorization_url: {{cognito_url}}/authorize
  access_token_url: {{cognito_url}}/token
  client_id: {{cognito_client_id}}
  client_secret: {{cognito_client_secret}}
  scope: openid profile email
  authentication_method: basic
  pkce: true
  token_header_prefix: Bearer
  token_id: credentials
}
{% endraw %}
`;
  fs.writeFileSync(collectionBruPath, collectionBruContent);
  console.log('Updated collection.bru with OAuth2 Authorization Code configuration.');
}

console.log('Post-processing complete. baseUrl replaced with url, dummy payloads generated, and Local environment created.');