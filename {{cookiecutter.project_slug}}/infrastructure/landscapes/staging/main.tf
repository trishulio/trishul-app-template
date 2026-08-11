terraform {
  backend "s3" {
    bucket   = "trishul-tfstate"
    key      = "apps/{{ cookiecutter.project_slug }}/terraform.staging.tfstate"
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
    key      = "platform/trishul/{{ cookiecutter.project_slug }}/terraform.staging.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

module "landscape_staging" {
  source                = "github.com/trishulio/infrastructure-provisioner//module-set/landscape"
  aws_account           = "992382473777"
  aws_region            = "ca-central-1"
  env_name              = "staging"
  app_name              = "{{ cookiecutter.project_slug }}"
  tld                   = "com"
  additional_urls       = ["https://localhost/"]
  app_logout_urls       = ["https://staging.{{ cookiecutter.fqdn }}/logout/", "https://localhost/logout/"]
  registry_mutability   = "MUTABLE"
  k8_cluster            = data.terraform_remote_state.platform.outputs.k8_cluster
  database              = data.terraform_remote_state.platform.outputs.database
  redis                 = data.terraform_remote_state.platform.outputs.redis
  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_api_token  = var.cloudflare_api_token
  is_cloud              = true
  load_balancer_ip      = data.terraform_remote_state.platform.outputs.load_balancer_ip
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

