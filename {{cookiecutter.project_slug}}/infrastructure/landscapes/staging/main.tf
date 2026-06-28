terraform {
  backend "s3" {
    bucket   = "saasforge-tfstate"
    key      = "apps/{{cookiecutter.project_slug}}/terraform.staging.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

module "landscape_staging" {
  source                      = "github.com/trishulio/infrastructure-provisioner//module-set/landscape"
  aws_account                 = "992382473777"
  aws_region                  = "ca-central-1"
  env_name                    = "staging"
  app_urls                    = ["https://staging.{{cookiecutter.fqdn}}/", "https://localhost/"]
  app_logout_urls             = ["https://staging.{{cookiecutter.fqdn}}/logout/", "https://localhost/logout/"]
  registry_mutability         = "MUTABLE"
  platform_tfstate_bucket     = "saasforge-tfstate"
  platform_tfstate_key_prefix = "platform/saasforge"
  platform_tfstate_region     = "ca-central-1"
  platform_tfstate_profile    = "engineering"
  platform_tfstate_role_arn   = "arn:aws:iam::211125344508:role/ResourceManager"
}
