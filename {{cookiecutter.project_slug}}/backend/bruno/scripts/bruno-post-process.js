const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// --- Helper Functions ---

/**
 * Parses all .env files in a given directory (e.g. backend dir) 
 * and merges them into a single object. 
 */
function parseEnvFiles(envDir) {
  const envFiles = [
    'app.env',
    'app-auth.env', 
    'app-db.env',
    'app-mt-provision.env',
    'app-secrets-manager.env'
  ];

  const mergedEnv = {};

  for (const file of envFiles) {
    const fullPath = path.join(envDir, file);
    if (fs.existsSync(fullPath)) {
      console.log(`Parsing ${file}...`);
      const envConfig = dotenv.parse(fs.readFileSync(fullPath));
      Object.assign(mergedEnv, envConfig);
    } else {
      console.warn(`Warning: ${file} not found in ${envDir}. Skipping.`);
    }
  }

  return mergedEnv;
}

/**
 * Creates the bruno.json structure.
 */
function createBrunoJson(projectName) {
  return {
    version: "1",
    name: projectName,
    type: "collection",
    ignore: ["node_modules", ".git"]
  };
}

/**
 * Creates the environments structure using values parsed from .env files.
 */
function createEnvironments(parsedEnv) {
  // Grab the needed values, fallback to placeholders if missing
  const cognitoUrl = parsedEnv.AWS_COGNITO_USER_POOL_URL || "https://cognito-idp.YOUR_REGION.amazonaws.com/YOUR_USER_POOL_ID";
  const cognitoClientId = parsedEnv.AWS_COGNITO_CLIENT_ID || "YOUR_CLIENT_ID";
  const cognitoClientSecret = parsedEnv.AWS_COGNITO_CLIENT_SECRET || "YOUR_CLIENT_SECRET";

  return {
    "development": {
      "name": "development",
      "variables": [
        {
          "name": "url",
          "value": "http://localhost:8080",
          "enabled": true,
          "secret": false,
          "type": "text"
        },
        {
          "name": "cognito_url",
          "value": cognitoUrl,
          "enabled": true,
          "secret": false,
          "type": "text"
        },
        {
          "name": "cognito_client_id",
          "value": cognitoClientId,
          "enabled": true,
          "secret": false,
          "type": "text"
        },
        {
          "name": "cognito_client_secret",
          "value": cognitoClientSecret,
          "enabled": true,
          "secret": true,
          "type": "text"
        },
        {
          "name": "cognito_redirect_url",
          "value": "http://localhost:8080/swagger-ui/oauth2-redirect.html",
          "enabled": true,
          "secret": false,
          "type": "text"
        },
        {
          "name": "active_tenant_id",
          "value": "",
          "enabled": true,
          "secret": false,
          "type": "text"
        }
      ]
    }
  };
}

/**
 * Writes a JSON object to a file.
 */
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Created ${path.basename(filePath)}`);
}

/**
 * Post-processes a .bru file (e.g. changing variables, adding headers).
 */
function processBruFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  {% raw %}
  // 1. Replace {{baseUrl}} with {{url}}
  content = content.replace(/\{\{baseUrl\}\}/g, '{{url}}');

  // 2. Add headers if not already present
  if (!content.includes('headers {') && content.includes('}')) {
    content = content.replace('}', `}

headers {
  X-Iaas-Token: {{$oauth2.credentials.id_token}}
  X-TENANT-ID: {{active_tenant_id}}
}`);
  }
  {% endraw %}

  fs.writeFileSync(filePath, content);
}

/**
 * Recursively scans a directory for .bru files and processes them.
 */
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.bru')) {
      processBruFile(fullPath);
    }
  }
}

// --- Main Script Execution ---

const PROJECT_NAME = "{{ cookiecutter.project_name }} API";

// Paths
const BACKEND_DIR = path.join(__dirname, '..', '..');
const BRUNO_COLLECTION_DIR = path.join(BACKEND_DIR, 'bruno-collection');
const BRUNO_ENV_DIR = path.join(BRUNO_COLLECTION_DIR, 'environments');

// 1. Ensure target directories exist
if (!fs.existsSync(BRUNO_COLLECTION_DIR)) {
  fs.mkdirSync(BRUNO_COLLECTION_DIR, { recursive: true });
}
if (!fs.existsSync(BRUNO_ENV_DIR)) {
  fs.mkdirSync(BRUNO_ENV_DIR, { recursive: true });
}

// 2. Parse .env files from the backend directory
console.log("Parsing .env files...");
const parsedEnv = parseEnvFiles(BACKEND_DIR);

// 3. Create bruno.json
console.log("Creating bruno.json...");
const brunoJson = createBrunoJson(PROJECT_NAME);
writeJsonFile(path.join(BRUNO_COLLECTION_DIR, 'bruno.json'), brunoJson);

// 4. Create development.bru in environments
console.log("Creating development.bru environment...");
const environments = createEnvironments(parsedEnv);
const devEnv = environments['development'];

{% raw %}
const devBruContent = `vars {
  url: ${devEnv.variables.find(v => v.name === 'url').value}
  cognito_url: ${devEnv.variables.find(v => v.name === 'cognito_url').value}
  cognito_client_id: ${devEnv.variables.find(v => v.name === 'cognito_client_id').value}
  cognito_redirect_url: ${devEnv.variables.find(v => v.name === 'cognito_redirect_url').value}
  active_tenant_id: ${devEnv.variables.find(v => v.name === 'active_tenant_id').value}
}
vars:secret [
  cognito_client_secret
]`;
{% endraw %}
fs.writeFileSync(path.join(BRUNO_ENV_DIR, 'development.bru'), devBruContent);

// 5. Create collection.bru with OAuth2 config
console.log("Creating collection.bru...");
{% raw %}
const collectionBruContent = `auth {
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
}`;
{% endraw %}
fs.writeFileSync(path.join(BRUNO_COLLECTION_DIR, 'collection.bru'), collectionBruContent);

// 6. Process all .bru files
console.log("Processing .bru files...");
processDirectory(BRUNO_COLLECTION_DIR);

console.log("Bruno post-processing complete!");
