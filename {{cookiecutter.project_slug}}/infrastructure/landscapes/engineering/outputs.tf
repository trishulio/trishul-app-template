output "aws_cognito_user_pool_id" {
    value = module.landscape_engineering.aws_cognito_user_pool_id
}

output "aws_cognito_identity_pool_id" {
    value = module.landscape_engineering.aws_cognito_identity_pool_id
}

output "aws_cognito_access_key_id" {
    value = module.landscape_engineering.aws_cognito_access_key_id
    sensitive = true
}

output "aws_cognito_access_secret_key" {
    value = module.landscape_engineering.aws_cognito_access_secret_key
    sensitive = true
}

output "aws_iam_access_key" {
    value = module.landscape_engineering.aws_iam_access_key
    sensitive = true
}

output "aws_iam_access_secret_key" {
    value = module.landscape_engineering.aws_iam_access_secret_key
    sensitive = true
}

output "aws_s3_access_key_id" {
    value = module.landscape_engineering.aws_s3_access_key_id
    sensitive = true
}

output "aws_s3_access_secret_key" {
    value = module.landscape_engineering.aws_s3_access_secret_key
    sensitive = true
}

output "aws_secrets_manager_access_key_id" {
    value = module.landscape_engineering.aws_secrets_manager_access_key_id
    sensitive = true
}

output "aws_secrets_manager_access_secret_key" {
    value = module.landscape_engineering.aws_secrets_manager_access_secret_key
    sensitive = true
}
