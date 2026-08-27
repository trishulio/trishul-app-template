terraform {
  backend "s3" {
    bucket   = "trishul-tfstate"
    key      = "apps/{{ cookiecutter.project_slug }}/terraform.engineering.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

module "landscape_engineering" {
  source          = "github.com/trishulio/infrastructure-provisioner//infra/module-sets/aws"
  aws_account     = "211125533390"
  aws_region      = "ca-central-1"
  env_name        = "engineering"
  app_name        = "{{ cookiecutter.project_slug }}"
  tld             = "{{ cookiecutter.tld }}"
  app_subdomain   = "engineering"
  additional_urls = ["https://localhost/"]
  app_logout_urls = ["https://localhost/logout/"]
  sentry_organization   = var.sentry_organization
  sentry_team           = var.sentry_team
  sentry_auth_token     = var.sentry_auth_token
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
