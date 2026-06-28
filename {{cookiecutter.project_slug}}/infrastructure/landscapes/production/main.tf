terraform {
  backend "s3" {
    bucket   = "saasforge-tfstate"
    key      = "apps/{{cookiecutter.project_slug}}/terraform.prod.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

module "landscape_production" {
  source                      = "github.com/trishulio/infrastructure-provisioner//module-set/landscape"
  aws_account                 = "471112695637"
  aws_region                  = "ca-central-1"
  env_name                    = "production"
  app_urls                    = ["https://{{cookiecutter.fqdn}}/"]
  app_logout_urls             = ["https://{{cookiecutter.fqdn}}/logout/"]
  registry_mutability         = "IMMUTABLE"
  platform_tfstate_bucket     = "saasforge-tfstate"
  platform_tfstate_key_prefix = "platform/saasforge"
  platform_tfstate_region     = "ca-central-1"
  platform_tfstate_profile    = "engineering"
  platform_tfstate_role_arn   = "arn:aws:iam::211125344508:role/ResourceManager"
}
