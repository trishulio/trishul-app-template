terraform {
  backend "s3" {
    bucket   = "trishul-tfstate"
    key      = "apps/{{ cookiecutter.project_slug }}/terraform.cloudville.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

data "terraform_remote_state" "platform" {
  backend = "s3"
  config = {
    bucket   = "trishul-tfstate"
    key      = "platform/trishul/terraform.cloudville.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

module "landscape_cloudville" {
  source              = "github.com/trishulio/infrastructure-provisioner//infra/landscape-templates/landscape-on-prem"
  aws_account         = "081212343238"
  aws_region          = "ca-central-1"
  env_name            = "cloudville"
  app_name            = "{{ cookiecutter.project_slug }}"
  tld                 = "com"
  additional_urls     = []
  app_logout_urls     = ["https://{{ cookiecutter.fqdn }}/logout/"]
  registry_mutability = "IMMUTABLE"
  database = {
    cluster        = merge(data.terraform_remote_state.platform.outputs.database_cluster, { private_host = "cloudville-database-postgresql.default" })
    app_user       = data.terraform_remote_state.platform.outputs.database_app_user
    db_private_url = replace(data.terraform_remote_state.platform.outputs.db_private_url, data.terraform_remote_state.platform.outputs.database_cluster.private_host, "cloudville-database-postgresql.default")
  }
  redis = {
    cluster = {
      private_host = "cloudville-redis-master.default"
      port         = 6379
      password     = "testredis"
    }
    redis_private_url = "redis://:testredis@cloudville-redis-master.default:6379"
  }
  kube_config_path      = pathexpand("~/.kube/cloudville.config")
  openrouter_app_key    = var.openrouter_app_key
  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_api_token  = var.cloudflare_api_token
  http_port             = 800
  https_port            = 4430
  sentry_organization   = var.sentry_organization
  sentry_team           = var.sentry_team
  sentry_auth_token     = var.sentry_auth_token
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare Account ID"
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API Token"
  sensitive   = true
}

variable "openrouter_app_key" {
  type        = string
  description = "OpenRouter API Key"
  sensitive   = true
}

variable "sentry_organization" {
  type        = string
  description = "The slug of the Sentry organization"
}

variable "sentry_team" {
  type        = string
  description = "The slug of the Sentry team"
}

variable "sentry_auth_token" {
  type        = string
  description = "The authentication token for Sentry"
  sensitive   = true
}
