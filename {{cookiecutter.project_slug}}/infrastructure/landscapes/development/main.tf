module "landscape_development" {
  source = "github.com/trishulio/infrastructure-provisioner//infra/landscape-templates/development"

  env_name                  = "development"
  aws_account               = "211125533390"
  aws_partition             = "aws"
  aws_region                = "ca-central-1"
  app_urls                  = ["https://localhost/"]
  k8_cluster                = var.k8_cluster
  kube_config_path          = pathexpand("~/.kube/desktop.config")
  platform_tfstate_bucket   = "trishul-tfstate"
  platform_tfstate_key      = "apps/{{ cookiecutter.project_slug }}/terraform.engineering.tfstate"
  platform_tfstate_region   = "ca-central-1"
  platform_tfstate_profile  = "engineering"
  platform_tfstate_role_arn = "arn:aws:iam::211125344508:role/ResourceManager"

  app_name = "{{ cookiecutter.project_slug }}"

  database = {
    cluster = {
      private_host = "host.minikube.internal"
      port         = 5432
      database     = "{{ cookiecutter.project_slug }}"
      user         = "postgres"
      password     = "postgres"
    }
    app_user = {
      name     = "postgres"
      password = "postgres"
    }
    db_private_url = "jdbc:postgresql://host.minikube.internal:5432/{{ cookiecutter.project_slug }}"
  }

  redis = {
    cluster = {
      private_host = "host.minikube.internal"
      port         = 6379
      password     = "dummy"
    }
    redis_private_url = "redis://host.minikube.internal:6379"
  }
}

variable "k8_cluster" {
  type        = any
  description = "Reference to the Kubernetes Cluster object"
  sensitive   = true
  default     = {}
}
