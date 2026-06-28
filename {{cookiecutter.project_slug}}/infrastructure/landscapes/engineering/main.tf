terraform {
  backend "s3" {
    bucket   = "saasforge-tfstate"
    key      = "apps/{{cookiecutter.project_slug}}/terraform.engineering.tfstate"
    region   = "ca-central-1"
    profile  = "engineering"
    role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
    encrypt  = true
  }
}

module "landscape_engineering" {
  source          = "github.com/trishulio/infrastructure-provisioner//module-set/aws"
  aws_account     = "211125533390"
  aws_region      = "ca-central-1"
  env_name        = "engineering"
  app_name        = "{{cookiecutter.project_slug}}"
  app_urls        = ["https://localhost/"]
  app_logout_urls = ["https://localhost/logout/"]
}
