terraform {
  backend "s3" {
    bucket   = "trishul-tfstate"
    key      = "apps/{{cookiecutter.project_slug}}/terraform.sandbox.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

module "landscape_sandbox" {
  source                      = "github.com/trishulio/infrastructure-provisioner//module-set/landscape"
  aws_account                 = "533267417788"
  aws_region                  = "ca-central-1"
  env_name                    = "sandbox"
  app_name                    = "{{cookiecutter.project_slug}}"
  app_urls                    = ["https://sandbox.{{cookiecutter.fqdn}}/", "https://localhost/"]
  app_logout_urls             = ["https://sandbox.{{cookiecutter.fqdn}}/logout/", "https://localhost/logout/"]
  registry_mutability         = "MUTABLE"
  platform_tfstate_bucket     = "trishul-tfstate"
  platform_tfstate_key_prefix = "platform/trishul"
  platform_tfstate_region     = "ca-central-1"
  platform_tfstate_profile    = "engineering"
  platform_tfstate_role_arn   = "arn:aws:iam::211125344508:role/ResourceManager"
}
