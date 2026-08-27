terraform {
  backend "s3" {
    bucket   = "trishul-tfstate"
    key      = "apps/{{ cookiecutter.project_slug }}/terraform.sandbox.tfstate"
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
    key      = "platform/trishul/{{ cookiecutter.project_slug }}/terraform.sandbox.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

module "landscape_sandbox" {
  source              = "github.com/trishulio/infrastructure-provisioner//module-set/landscape"
  aws_account         = "533267417788"
  aws_region          = "ca-central-1"
  env_name            = "sandbox"
  app_name            = "{{ cookiecutter.project_slug }}"
  tld                 = "com"
  additional_urls     = ["https://localhost/"]
  app_logout_urls     = ["https://sandbox.{{ cookiecutter.fqdn }}/logout/", "https://localhost/logout/"]
  registry_mutability = "MUTABLE"
  k8_cluster          = data.terraform_remote_state.platform.outputs.k8_cluster
  database            = data.terraform_remote_state.platform.outputs.database
  redis               = data.terraform_remote_state.platform.outputs.redis
  is_cloud            = true
  load_balancer_ip    = data.terraform_remote_state.platform.outputs.load_balancer_ip
  sentry_organization = var.sentry_organization
  sentry_team         = var.sentry_team
  sentry_auth_token   = var.sentry_auth_token
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
