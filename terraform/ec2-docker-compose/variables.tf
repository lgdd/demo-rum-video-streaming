variable "region" {
  type    = string
  default = "eu-north-1"
}

variable "instance_type" {
  type    = string
  default = "t3.xlarge"
}

variable "storage_in_gb" {
  type    = string
  default = "20"
}

resource "random_string" "rum_video_streaming_id" {
  length  = 8
  special = false
}

variable "ec2_instance_name" {
  type    = string
  default = "rum_video_streaming"
}

variable "ec2_key_name" {
  type = string
}

variable "ami_id" {
  type    = string
  default = "ami-0c1ac8a41498c1a9c"
}

variable "vpc_cidr_block" {
  type    = string
  default = "10.0.0.0/16"
}

variable "subnet_cidr_block" {
  type    = string
  default = "10.0.1.0/24"
}

// Populate by environment variable TF_VAR_my_public_ip_cidr
variable "my_public_ip_cidr" {
  type = string
}

// Can be populated by environment variable TF_VAR_dd_api_key
variable "dd_api_key" {
  type      = string
  sensitive = true
}

// Can be populated by environment variable TF_VAR_dd_app_key
variable "dd_app_key" {
  type      = string
  sensitive = true
}

// Can be overwritten by TF_VAR_dd_site
variable "dd_site" {
  type    = string
  default = "datadoghq.com"
}

// Can be populated by environment variable TF_VAR_dd_rum_video_streaming_rum_app_id
variable "dd_rum_video_streaming_rum_app_id" {
  type = string
}

// Can be populated by environment variable TF_VAR_dd_rum_video_streaming_rum_client_token
variable "dd_rum_video_streaming_rum_client_token" {
  type = string
}

// Can be populated by environment variable TF_VAR_mux_token_id
variable "mux_token_id" {
  type = string
}

// Can be populated by environment variable TF_VAR_mux_token_secret
variable "mux_token_secret" {
  type = string
}
