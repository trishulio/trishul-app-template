const fs = require('fs');
const path = require('path');

const openapiSampler = require('openapi-sampler');

const openapiPath = path.join(__dirname, '../../api/openapi.json');
const collectionPath = path.join(__dirname, '../../bruno-collection');

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

{% raw %}
  // 1. Replace {{baseUrl}} with {{url}}
  content = content.replace(/\{\{baseUrl\}\}/g, '{{url}}');
{% endraw %}

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

// 4. Create the Environment file from the single fixed backend/bruno.env
function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const backendDir = path.join(__dirname, '../..');
const envFilePath = path.join(backendDir, 'bruno.env');

const envDir = path.join(collectionPath, 'environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

if (fs.existsSync(envFilePath)) {
  const envVars = parseEnvFile(envFilePath);

  const rootDir = path.join(backendDir, '..');
  const landscapesDir = path.join(rootDir, 'infrastructure', 'landscapes');
  
  let environments = [];
  if (fs.existsSync(landscapesDir)) {
    environments = fs.readdirSync(landscapesDir).filter(f => fs.statSync(path.join(landscapesDir, f)).isDirectory());
  }
  
  if (!environments.includes('local')) {
    environments.push('local');
  }

  for (const envName of environments) {
    const getVal = (key) => {
      const k1 = `${envName}__${key}`;
      const k2 = `${envName.toUpperCase()}__${key}`;
      const k3 = `${envName.toLowerCase()}__${key}`;
      // Fallback for local without prefix
      if (envName === 'local' && (envVars[key] !== undefined)) {
        return envVars[key];
      }
      return envVars[k1] || envVars[k2] || envVars[k3] || '';
    };

    const envContent = `vars {
  cognito_client_secret: ${getVal('COGNITO_CLIENT_SECRET')}
  cognito_client_id: ${getVal('COGNITO_CLIENT_ID')}
  cognito_url: ${getVal('COGNITO_URL')}
  cognito_redirect_url: ${getVal('COGNITO_REDIRECT_URL')}
  url: ${getVal('URL') || getVal('APP_URL')}
  active_tenant_id: ${getVal('ACTIVE_TENANT_ID')}
  tenant_id: ${getVal('TENANT_ID')}
}
`;
    // Name the file properly e.g. Cloudville.bru
    const bruFileName = envName.charAt(0).toUpperCase() + envName.slice(1) + '.bru';
    const outPath = path.join(envDir, bruFileName);
    fs.writeFileSync(outPath, envContent);
    console.log(`Created environment file for ${envName} at ${outPath}`);
  }
}

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
  scope: email openid phone
  state:
  pkce: true
  token_header_prefix: Bearer
}
{% endraw %}
`;

  fs.writeFileSync(collectionBruPath, collectionBruContent);
}

console.log('Bruno post-processing complete!');