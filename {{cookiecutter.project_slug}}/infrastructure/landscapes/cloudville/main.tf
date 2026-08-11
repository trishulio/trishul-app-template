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
  source              = "../../../../infrastructure-provisioner/module-set/landscape"
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
  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_api_token  = var.cloudflare_api_token
  http_port             = 800
  https_port            = 4430
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
