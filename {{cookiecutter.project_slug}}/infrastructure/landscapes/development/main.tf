module "landscape_development" {
  source = "github.com/trishulio/infrastructure-provisioner//module-set/development"

  env_name                  = "development"
  aws_account               = "211125533390"
  aws_partition             = "aws"
  aws_region                = "ca-central-1"
  app_urls                  = ["https://localhost/"]
  k8_cluster                = var.k8_cluster
  platform_tfstate_bucket   = "saasforge-tfstate"
  platform_tfstate_key      = "apps/{{cookiecutter.project_slug}}/terraform.engineering.tfstate"
  platform_tfstate_region   = "ca-central-1"
  platform_tfstate_profile  = "engineering"
  platform_tfstate_role_arn = "arn:aws:iam::211125344508:role/ResourceManager"
}

variable "k8_cluster" {
  type        = any
  description = "Reference to the Kubernetes Cluster object"
  sensitive   = true
}
